import firebase, { auth, fireStore } from '../firebase';
import { NotificationManager } from 'react-notifications';
import {
    REQUIREMENTS__SET_IS_FORM_OPEN,
    REQUIREMENTS__SET_FORM_TYPE,
    REQUIREMENTS__SET_EDIT_FORM_DATA,
    REQUIREMENTS__SET_IS_DELETE_DIALOG_OPEN,
    REQUIREMENTS__ENABLE_DELETE_DIALOG,
    REQUIREMENTS__DISABLE_DELETE_DIALOG,
    REQUIREMENTS__SET_REQUIREMENTS,
    REQUIREMENTS__STOP_REQUIREMENTS_LOADING,
    REQUIREMENTS__START_REQUIREMENTS_LOADING
} from './types';
import { getProjectDetails } from './ProjectDetailsActions';
import { getCurrentUserData } from '../helpers/helpers';
import moment from 'moment';

export function getRequirements() {
    return async (dispatch, getState) => {
        dispatch({ type: REQUIREMENTS__START_REQUIREMENTS_LOADING });
        try {
            const collectionRef = fireStore.collection('Requirement');
            const projectDetails = getState().projectDetails.details;
            const response = await collectionRef
                .where('ProjectDocumentID', '==', projectDetails.uid)
                .where('IsDelete', '==', false)
                .get();

            let dataArray = [];
            response.docs.forEach(value => {
                dataArray.push({
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
                    '': value.data(),
                    uid: value.id
                });
            });

            // Sort by LastModifiedOn
            dataArray = dataArray.sort(
                (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
            );

            dispatch({ type: REQUIREMENTS__SET_REQUIREMENTS, data: dataArray });
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while fetching requirements.'
            );
        }
        dispatch({ type: REQUIREMENTS__STOP_REQUIREMENTS_LOADING });
    };
}

export function addRequirements(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);
            const projectDetails = getState().projectDetails.details;

            const requirement = {
                ...values,
                UserDocumentID: auth.currentUser.uid,
                CreatedBy: userData.Email,
                CreatedOn: new Date(),
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date(),
                ProjectDocumentID: projectDetails.uid,
                IsDelete: false
            };

            await fireStore.collection('Requirement').add(requirement);
            NotificationManager.success('New requirement added successfully');

            // Close the form
            dispatch(setIsFormOpenRequirement(false));

            dispatch(getRequirements());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while adding new requirement.'
            );
            setSubmitting(false);
        }
    };
}

export function deleteRequirement(index) {
    return async (dispatch, getState) => {
        dispatch({ type: REQUIREMENTS__DISABLE_DELETE_DIALOG });
        try {
            const requirement = getState().requirements.requirements[index];

            const docRef = fireStore
                .collection('Requirement')
                .doc(requirement.uid);
            await docRef.update({
                IsDelete: true
            });

            NotificationManager.success('Requirement deleted successfully.');

            // Close the delete dialog
            dispatch(setIsDeleteDialogOpenRequirement(false));

            // Reload the projects
            dispatch(getRequirements());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while deleting the project.'
            );
        }
        dispatch({ type: REQUIREMENTS__ENABLE_DELETE_DIALOG });
    };
}

export function updateRequirement(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);

            const docRef = fireStore
                .collection('Requirement')
                .doc(getState().requirements.editFormData.uid);
            await docRef.update({
                ...values,
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date()
            });

            NotificationManager.success('Requirement updated successfully.');

            // Close the form
            dispatch(setIsFormOpenRequirement(false));

            // Reload the project
            dispatch(getRequirements());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while updating the requirement.'
            );
            setSubmitting(false);
        }
    };
}

export function setIsFormOpenRequirement(data) {
    return async dispatch => {
        dispatch({ type: REQUIREMENTS__SET_IS_FORM_OPEN, data });
    };
}

export function setFormTypeRequirement(data) {
    return async dispatch => {
        dispatch({ type: REQUIREMENTS__SET_FORM_TYPE, data });
    };
}

export function setEditFormDataRequirement(data) {
    return async dispatch => {
        dispatch({ type: REQUIREMENTS__SET_EDIT_FORM_DATA, data });
    };
}

export function setIsDeleteDialogOpenRequirement(data) {
    return async dispatch => {
        dispatch({ type: REQUIREMENTS__SET_IS_DELETE_DIALOG_OPEN, data });
    };
}
