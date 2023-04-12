import firebase, { auth, fireStore } from '../firebase';
import { NotificationManager } from 'react-notifications';
import {
    TASK__SET_IS_FORM_OPEN,
    TASK__SET_FORM_TYPE,
    TASK__SET_EDIT_FORM_DATA,
    TASK__SET_IS_DELETE_DIALOG_OPEN,
    TASK__ENABLE_DELETE_DIALOG,
    TASK__DISABLE_DELETE_DIALOG,
    TASK__SET_TASK,
    TASK__STOP_TASK_LOADING,
    TASK__START_TASK_LOADING
} from './types';
import { getCurrentUserData } from '../helpers/helpers';
import moment from 'moment';

export function getTasks() {
    return async (dispatch, getState) => {
        dispatch({ type: TASK__START_TASK_LOADING });
        try {
            const collectionRef = fireStore.collection('Task');
            const projectDetails = getState().projectDetails.details;
            const responseTask = await collectionRef
                .where('ProjectDocumentID', '==', projectDetails.uid)
                .where('IsDelete', '==', false)
                .get();

            let dataArray = [];
            responseTask.docs.forEach(value => {
                const emails = Object.values(value.data().TaskAssigneeMap);

                const tmp = {
                    ...value.data(),
                    AssignedTo: emails.join(', '),
                    assignedToOriginal: emails,
                    lastModified: value.data().LastModifiedBy,
                    createByOn: value.data().CreatedBy,
                    uid: value.id,
                    DueDate: moment(value.data().DueDate.seconds * 1000).format(
                        'YYYY-MM-DD'
                    )
                };
                dataArray.push({
                    ...tmp,
                    '': tmp
                });
            });

            // Sort by LastModifiedOn
            dataArray = dataArray.sort(
                (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
            );

            dispatch({ type: TASK__SET_TASK, data: dataArray });
        } catch (err) {
            console.error({ err });;
            NotificationManager.error('Error occurred while fetching Task.');
        }
        dispatch({ type: TASK__STOP_TASK_LOADING });
    };
}

export function addTask(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);
            const projectDetails = getState().projectDetails.details;

            // Get workPackage by uid
            let workPackage = {};

            console.log("valuesvalues5",values, getState().workPackages.workPackages)

            getState().workPackages.workPackages.forEach(val => {
                if (val.requirementid == values.workPackage) {
                    workPackage = val;
                }
            });

            const [uids, AssigneeMap] = await getUIDfromEmails(
                values.AssignedTo
            );

            const task = {
                WorkPackageID: workPackage.requirementid,
                WorkPackageName: workPackage.RequirementType,
                TaskName: values.TaskName,
                Description: values.Description,
                DueDate: values.DueDate,
                Status: values.Status,
                CreatedBy: userData.Email,
                CreatedOn: new Date(),
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date(),
                ProjectDocumentID: projectDetails.uid,
                IsDelete: false,
                TaskAssigneeList: uids,
                TaskAssigneeMap: AssigneeMap
            };

            const batch = firebase.firestore().batch();
            const taskDocRef = firebase
                .firestore()
                .collection('Task')
                .doc();
            batch.set(taskDocRef, task);

            await batch.commit();

            NotificationManager.success('New Task added successfully');

            // Close the form
            dispatch(setIsFormOpenTask(false));

            dispatch(getTasks());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error('Error occurred while adding new task.');
            setSubmitting(false);
        }
    };
}

async function getUIDfromEmails(emails) {
    const response = await fireStore
        .collection('users')
        .where('Email', 'in', emails)
        .get();

    const uids = [];
    const AssigneeMap = {};
    response.docs.forEach(doc => {
        uids.push(doc.id);
        AssigneeMap[doc.id] = doc.data().Email;
    });
    return [uids, AssigneeMap];
}

export function deleteTask(index) {
    return async (dispatch, getState) => {
        dispatch({ type: TASK__DISABLE_DELETE_DIALOG });
        try {
            const task = getState().tasks.tasks[index];
            const projectDetails = getState().projectDetails.details;

            let batch = firebase.firestore().batch();

            // Delete from Task collection
            const docRef = fireStore.collection('Task').doc(task.uid);
            batch.update(docRef, {
                IsDelete: true
            });

            await batch.commit();

            NotificationManager.success('Task deleted successfully.');

            // Close the delete dialog
            dispatch(setIsDeleteDialogOpenTask(false));

            // Reload the projects
            dispatch(getTasks());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while deleting the project.'
            );
        }
        dispatch({ type: TASK__ENABLE_DELETE_DIALOG });
    };
}

export function updateTask(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);
            const batch = firebase.firestore().batch();

            // Get workPackage by uid
            let workPackage = {};
            getState().workPackages.workPackages.forEach(val => {
                if (val.uid == values.workPackage) {
                    workPackage = val;
                }
            });

            const [uids, AssigneeMap] = await getUIDfromEmails(
                values.AssignedTo
            );

            // Update task
            const task = {
                TaskName: values.TaskName,
                Description: values.Description,
                DueDate: values.DueDate,
                Status: values.Status,
                WorkPackageID: workPackage.uid,
                WorkPackageName: workPackage.Name,
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date(),
                TaskAssigneeList: uids,
                TaskAssigneeMap: AssigneeMap
            };
            batch.update(
                fireStore
                    .collection('Task')
                    .doc(getState().tasks.editFormData.uid),
                task
            );

            await batch.commit();

            NotificationManager.success('Task updated successfully.');

            // Close the form
            dispatch(setIsFormOpenTask(false));

            // Reload the project
            dispatch(getTasks());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while updating the Work Package.'
            );
            setSubmitting(false);
        }
    };
}

export function setIsFormOpenTask(data) {
    return async dispatch => {
        dispatch({ type: TASK__SET_IS_FORM_OPEN, data });
    };
}

export function setFormTypeTask(data) {
    return async dispatch => {
        dispatch({ type: TASK__SET_FORM_TYPE, data });
    };
}

export function setEditFormDataTask(data) {
    return async dispatch => {
        dispatch({ type: TASK__SET_EDIT_FORM_DATA, data });
    };
}

export function setIsDeleteDialogOpenTask(data) {
    return async dispatch => {
        dispatch({ type: TASK__SET_IS_DELETE_DIALOG_OPEN, data });
    };
}
