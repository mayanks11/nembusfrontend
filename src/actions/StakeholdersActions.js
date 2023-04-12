import firebase, { auth, fireStore } from '../firebase';
import { NotificationManager } from 'react-notifications';
import {
    STAKEHOLDERS__SET_STAKEHOLDERS,
    STAKEHOLDERS__STOP_STAKEHOLDERS_LOADING,
    STAKEHOLDERS__START_STAKEHOLDERS_LOADING
} from 'Actions/types';
import {
    STAKEHOLDERS__SET_IS_FORM_OPEN,
    STAKEHOLDERS__SET_FORM_TYPE,
    STAKEHOLDERS__SET_EDIT_FORM_DATA,
    STAKEHOLDERS__SET_IS_DELETE_DIALOG_OPEN,
    STAKEHOLDERS__ENABLE_DELETE_DIALOG,
    STAKEHOLDERS__DISABLE_DELETE_DIALOG
} from './types';
import { getProjectDetails } from './ProjectDetailsActions';
import { updateStakeholderMap } from './ProjectDetailsActions';
import { getCurrentUserData, isUserWithEmailExist } from '../helpers/helpers';
import history from '../helpers/history';
import moment from 'moment';

export function getStakeholders() {
    return async (dispatch, getState) => {
        dispatch({ type: STAKEHOLDERS__START_STAKEHOLDERS_LOADING });
        try {
            const collectionRef = fireStore.collection('StakeHolder');
            const projectDetails = getState().projectDetails.details;
            const response = await collectionRef
                .where('ProjectDocumentID', '==', projectDetails.uid)
                .where('IsDelete', '==', false)
                .get();

            let dataArray = [];
            response.docs.forEach(value => {
                dataArray.push({
                    uid: value.id,
                    ...value.data(),
                    lastModified: `${value.data().LastModifiedBy} / ${moment(
                        value.data().LastModifiedOn.seconds * 1000
                    )
                        .utc()
                        .format('YYYY-MM-DD')}`,
                    createByOn: `${value.data().CreatedBy} / ${moment(
                        value.data().CreatedOn.seconds * 1000
                    )
                        .utc()
                        .format('YYYY-MM-DD')}`,
                    '': value.data()
                });
            });

            // Sort by LastModifiedOn
            dataArray = dataArray.sort(
                (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
            );

            dispatch({ type: STAKEHOLDERS__SET_STAKEHOLDERS, data: dataArray });
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while fetching stakeholders.'
            );
        }
        dispatch({ type: STAKEHOLDERS__STOP_STAKEHOLDERS_LOADING });
    };
}

export function addStakeholder(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);

            let { userByEmailData, result } = await isUserWithEmailExist(
                values.Email,
                setSubmitting
            );
            if (result == true) return;

            // Check if stakeholder with same email exist
            const projectDetails = getState().projectDetails.details;
            result = await isStakeholderWithEmailAlreadyExist(
                projectDetails,
                values.Email,
                setSubmitting
            );
            if (result) return;

            const stakeholder = {
                ...values,
                UserDocumentID: auth.currentUser.uid,
                CreatedBy: userData.Email,
                CreatedOn: new Date(),
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date(),
                ProjectName: projectDetails.ProjectName,
                ProjectDocumentID: projectDetails.uid,
                IsDelete: false
            };

            await fireStore.runTransaction(async transaction => {
                // Add stakeholder
                const docRef = fireStore.collection('StakeHolder').doc();
                await transaction.set(docRef, stakeholder);

                // Update StakeholderList in PROJECT collection
                const projectRef = fireStore
                    .collection('PROJECT')
                    .doc(projectDetails.uid);
                await transaction.update(projectRef, {
                    [`StackholderList.${userByEmailData.id}`]: values.Permission
                });
            });
            NotificationManager.success('New stakeholder added successfully');

            // Add to stakeholderList in projectDetails
            dispatch(
                updateStakeholderMap({
                    key: userByEmailData.id,
                    value: values.Permission
                })
            );

            // Close the form
            dispatch(setIsFormOpenStakeholder(false));

            // Reload the project
            dispatch(getStakeholders());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while adding new stakeholder.'
            );
            setSubmitting(false);
        }
    };
}

async function isStakeholderWithEmailAlreadyExist(
    projectDetails,
    Email,
    setSubmitting
) {
    Email = Email.toLowerCase();
    const doc = await fireStore
        .collection('StakeHolder')
        .where('ProjectDocumentID', '==', projectDetails.uid)
        .where('Email', '==', Email)
        .where('IsDelete', '==', false)
        .get();
    if (!doc.empty) {
        NotificationManager.error('Stakeholder with same Email address exist.');
        setSubmitting(false);
        return true;
    }
}

export function deleteStakeholder(index) {
    return async (dispatch, getState) => {
        dispatch({ type: STAKEHOLDERS__DISABLE_DELETE_DIALOG });
        try {
            const stakeholder = getState().stakeholders.stakeholders[index];
            const projectDetails = getState().projectDetails.details;

            // Check if any task is assigned to the stakeholder
            const docs = await fireStore
                .collection('TaskAssign')
                .where('ProjectDocumentID', '==', projectDetails.uid)
                .where('AssignedTo', '==', stakeholder.Email)
                .where('IsDelete', '==', false)
                .get();
            if (docs.size > 0) {
                NotificationManager.error(
                    `Stakeholder have ${docs.size} tasked assigned. Stakeholder cannot be removed from the stakeholder list until the task is deleted or updated with any other stakeholder.`
                );
                // Close the delete dialog
                dispatch(setIsDeleteDialogOpenStakeholder(false));
                return true;
            }

            // Check if there is only one admin for project
            if (stakeholder.Permission == 'admin') {
                const docs = await fireStore
                    .collection('StakeHolder')
                    .where('ProjectDocumentID', '==', projectDetails.uid)
                    .where('Permission', '==', 'admin')
                    .where('IsDelete', '==', false)
                    .get();
                if (docs.size <= 1) {
                    NotificationManager.error(
                        `You can't delete the only 'admin' of the project`
                    );
                    // Close the delete dialog
                    dispatch(setIsDeleteDialogOpenStakeholder(false));
                    return true;
                }
            }

            const response = await fireStore
                .collection('StakeHolder')
                .where('ProjectDocumentID', '==', projectDetails.uid)
                .where('Email', '==', stakeholder.Email)
                .get();

            let batch = firebase.firestore().batch();
            // Delete from stakeholder collection
            response.docs.forEach(doc => {
                const docRef = firebase
                    .firestore()
                    .collection('StakeHolder')
                    .doc(doc.id);
                batch.update(docRef, {
                    IsDelete: true
                });
            });

            // Update StakeholderList in PROJECT collection
            const userByEmail = await fireStore
                .collection('users')
                .where('Email', '==', stakeholder.Email)
                .get();
            const projectRef = fireStore
                .collection('PROJECT')
                .doc(projectDetails.uid);
            batch.update(projectRef, {
                [`StackholderList.${userByEmail.docs[0].id}`]: 'deleted'
            });

            await batch.commit();

            NotificationManager.success('Stakeholder deleted successfully.');

            // update stakeholderList in projectDetails
            dispatch(
                updateStakeholderMap({
                    key: userByEmail.docs[0].id,
                    value: 'deleted'
                })
            );

            // Close the delete dialog
            dispatch(setIsDeleteDialogOpenStakeholder(false));

            // Check if user removed itself
            const { userData } = await getCurrentUserData(dispatch, getState);
            if (userData.Email == stakeholder.Email) {
                // Redirect to projects
                history.push(`/app/projects`);
                return;
            }

            // Reload the projects
            dispatch(getStakeholders());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while deleting the project.'
            );
        }
        dispatch({ type: STAKEHOLDERS__ENABLE_DELETE_DIALOG });
    };
}

export function updateStakeholder(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);
            const projectDetails = getState().projectDetails.details;

            // Check if there is only one admin for project
            if (
                getState().stakeholders.editFormData.Permission == 'admin' &&
                getState().stakeholders.editFormData.Permission !=
                    values.Permission
            ) {
                const docs = await fireStore
                    .collection('StakeHolder')
                    .where('ProjectDocumentID', '==', projectDetails.uid)
                    .where('Permission', '==', 'admin')
                    .get();
                if (docs.size <= 1) {
                    NotificationManager.error(
                        `You can't update the Permission of last admin.`
                    );
                    setSubmitting(false);
                    return true;
                }
            }

            // Check if user with email exist
            let { userByEmailData, result } = await isUserWithEmailExist(
                values.Email,
                setSubmitting
            );
            if (result == true) return;

            // Check if stakeholder with same email exist

            if (getState().stakeholders.editFormData.Email != values.Email) {
                result = await isStakeholderWithEmailAlreadyExist(
                    projectDetails,
                    values.Email,
                    setSubmitting
                );
                if (result) return;
            }

            const response = await fireStore
                .collection('StakeHolder')
                .where('ProjectDocumentID', '==', projectDetails.uid)
                .where(
                    'Email',
                    '==',
                    getState().stakeholders.editFormData.Email
                )
                .get();

            let batch = firebase.firestore().batch();
            response.docs.forEach(doc => {
                const docRef = firebase
                    .firestore()
                    .collection('StakeHolder')
                    .doc(doc.id);
                batch.update(docRef, {
                    LastModifiedBy: userData.Email,
                    LastModifiedOn: new Date(),
                    ...values
                });
            });

            // Update StakeholderList in PROJECT collection
            const projectRef = fireStore
                .collection('PROJECT')
                .doc(projectDetails.uid);
            batch.update(projectRef, {
                [`StackholderList.${userByEmailData.id}`]: values.Permission
            });
            await batch.commit();
            NotificationManager.success('Stakeholder updated successfully.');

            // update stakeholderList in projectDetails
            dispatch(
                updateStakeholderMap({
                    key: userByEmailData.id,
                    value: values.Permission
                })
            );

            // Close the form
            dispatch(setIsFormOpenStakeholder(false));

            // Reload the project
            dispatch(getStakeholders());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while updating the stakeholder.'
            );
            setSubmitting(false);
        }
    };
}

export function setIsFormOpenStakeholder(data) {
    return async dispatch => {
        dispatch({ type: STAKEHOLDERS__SET_IS_FORM_OPEN, data });
    };
}

export function setFormTypeStakeholder(data) {
    return async dispatch => {
        dispatch({ type: STAKEHOLDERS__SET_FORM_TYPE, data });
    };
}

export function setEditFormDataStakeholder(data) {
    return async dispatch => {
        dispatch({ type: STAKEHOLDERS__SET_EDIT_FORM_DATA, data });
    };
}

export function setIsDeleteDialogOpenStakeholder(data) {
    return async dispatch => {
        dispatch({ type: STAKEHOLDERS__SET_IS_DELETE_DIALOG_OPEN, data });
    };
}
