import firebase, { auth, fireStore } from '../firebase';
import { NotificationManager } from 'react-notifications';
import {
    SIMULATION__SET_IS_FORM_OPEN,
    SIMULATION__SET_FORM_TYPE,
    SIMULATION__SET_EDIT_FORM_DATA,
    SIMULATION__SET_IS_DELETE_DIALOG_OPEN,
    SIMULATION__ENABLE_DELETE_DIALOG,
    SIMULATION__DISABLE_DELETE_DIALOG,
    SIMULATION__SET_SIMULATION,
    SIMULATION__STOP_SIMULATION_LOADING,
    SIMULATION__START_SIMULATION_LOADING
} from './types';
import { getProjectDetails } from './ProjectDetailsActions';
import { getCurrentUserData } from '../helpers/helpers';

export function getSimulations() {
    return async (dispatch, getState) => {
        dispatch({ type: SIMULATION__START_SIMULATION_LOADING });
        try {
            const projectDetails = getState().projectDetails.details;
            const collectionRef = fireStore
                .collection('PROJECT')
                .doc(projectDetails.uid)
                .collection('Simulation');
            const response = await collectionRef
                .where('IsDelete', '==', false)
                .get();

            let dataArray = [];
            response.docs.forEach(value => {
                dataArray.push({
                    ...value.data(),
                    StartDate: value.data().StartDate.toDate(),
                    EndDate: value.data().EndDate.toDate(),
                    lastModified: value.data().LastModifiedBy,
                    createByOn: value.data().CreatedBy,
                    '': value.data(),
                    uid: value.id
                });
            });

            // Sort by LastModifiedOn
            dataArray = dataArray.sort(
                (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
            );

            dispatch({ type: SIMULATION__SET_SIMULATION, data: dataArray });
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while fetching Simulations.'
            );
        }
        dispatch({ type: SIMULATION__STOP_SIMULATION_LOADING });
    };
}

export function addSimulation(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);
            const projectDetails = getState().projectDetails.details;

            if (
                await isSimulationWithSameNameExist({
                    projectID: projectDetails.uid,
                    SimulationName: values.SimulationName,
                    setSubmitting
                })
            )
                return;

            const simulation = {
                ...values,
                StartDate: firebase.firestore.Timestamp.fromDate(
                    values.StartDate.toDate()
                ),
                EndDate: firebase.firestore.Timestamp.fromDate(
                    values.EndDate.toDate()
                ),
                CreatedBy: userData.Email,
                CreatedOn: new Date(),
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date(),
                ProjectDocumentID: projectDetails.uid,
                IsDelete: false
            };

            await fireStore
                .collection('PROJECT')
                .doc(projectDetails.uid)
                .collection('Simulation')
                .add(simulation);
            NotificationManager.success('New simulation added successfully');

            // Close the form
            dispatch(setIsFormOpenSimulation(false));

            dispatch(getSimulations());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while adding new Simulation.'
            );
            setSubmitting(false);
        }
    };
}

async function isSimulationWithSameNameExist({
    projectID,
    SimulationName,
    setSubmitting
}) {
    // Check if project with same name exist
    const doc = await fireStore
        .collection('PROJECT')
        .doc(projectID)
        .collection('Simulation')
        .where('SimulationName', '==', SimulationName)
        .where('IsDelete', '==', false)
        .get();

    if (!doc.empty) {
        NotificationManager.error('Simulation with same name already exist.');
        setSubmitting(false);
        return true;
    }
}

export function deleteSimulation(index) {
    return async (dispatch, getState) => {
        dispatch({ type: SIMULATION__DISABLE_DELETE_DIALOG });
        try {
            const simulation = getState().simulations.simulations[index];
            const projectDetails = getState().projectDetails.details;

            const docRef = fireStore
                .collection('PROJECT')
                .doc(projectDetails.uid)
                .collection('Simulation')
                .doc(simulation.uid);
            await docRef.update({
                IsDelete: true
            });

            NotificationManager.success('Simulation deleted successfully.');

            // Close the delete dialog
            dispatch(setIsDeleteDialogOpenSimulation(false));

            // Reload the projects
            dispatch(getSimulations());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while deleting the project.'
            );
        }
        dispatch({ type: SIMULATION__ENABLE_DELETE_DIALOG });
    };
}

export function updateSimulation(values, setSubmitting) {
    return async (dispatch, getState) => {
        try {
            const { userData } = await getCurrentUserData(dispatch, getState);
            const projectDetails = getState().projectDetails.details;

            if (
                getState().simulations.editFormData.SimulationName !=
                values.SimulationName
            ) {
                if (
                    await isSimulationWithSameNameExist({
                        projectID: projectDetails.uid,
                        SimulationName: values.SimulationName,
                        setSubmitting
                    })
                )
                    return;
            }

            const docRef = fireStore
                .collection('PROJECT')
                .doc(projectDetails.uid)
                .collection('Simulation')
                .doc(getState().simulations.editFormData.uid);
            await docRef.update({
                ...values,
                StartDate: firebase.firestore.Timestamp.fromDate(
                    values.StartDate.toDate()
                ),
                EndDate: firebase.firestore.Timestamp.fromDate(
                    values.EndDate.toDate()
                ),
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date()
            });

            NotificationManager.success('Simulation updated successfully.');

            // Close the form
            dispatch(setIsFormOpenSimulation(false));

            // Reload the project
            dispatch(getSimulations());
        } catch (err) {
            console.error({ err });;
            NotificationManager.error(
                'Error occurred while updating the Simulation.'
            );
            setSubmitting(false);
        }
    };
}

export function setIsFormOpenSimulation(data) {
    return async dispatch => {
        dispatch({ type: SIMULATION__SET_IS_FORM_OPEN, data });
    };
}

export function setFormTypeSimulation(data) {
    return async dispatch => {
        dispatch({ type: SIMULATION__SET_FORM_TYPE, data });
    };
}

export function setEditFormDataSimulation(data) {
    return async dispatch => {
        dispatch({ type: SIMULATION__SET_EDIT_FORM_DATA, data });
    };
}

export function setIsDeleteDialogOpenSimulation(data) {
    return async dispatch => {
        dispatch({ type: SIMULATION__SET_IS_DELETE_DIALOG_OPEN, data });
    };
}
