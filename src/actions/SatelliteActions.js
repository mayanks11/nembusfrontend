import firebase, { auth, fireStore } from '../firebase';
import { NotificationManager } from 'react-notifications';
import {
  SATELLITE__SET_IS_FORM_OPEN,
  SATELLITE__SET_FORM_TYPE,
  SATELLITE__SET_EDIT_FORM_DATA,
  SATELLITE__SET_IS_DELETE_DIALOG_OPEN,
  SATELLITE__ENABLE_DELETE_DIALOG,
  SATELLITE__DISABLE_DELETE_DIALOG,
  SATELLITE__SET_SATELLITE,
  SATELLITE__STOP_SATELLITE_LOADING,
  SATELLITE__START_SATELLITE_LOADING
} from './types';
import { getProjectDetails } from './ProjectDetailsActions';
import { getCurrentUserData } from '../helpers/helpers';
import moment from 'moment';
import ComponentApi from '../../src/api/Component';

export function getSatellites() {
  return async (dispatch, getState) => {
    dispatch({ type: SATELLITE__START_SATELLITE_LOADING });
    try {
      const collectionRef = fireStore.collection('Satellite');
      const projectDetails = getState().projectDetails.details;
      const response = await collectionRef
        .where('ProjectDocumentID', '==', projectDetails.uid)
        .where('IsDelete', '==', false)
        .get();

      let dataArray = [];
      response.docs.forEach(value => {
        const data = {
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
          uid: value.id
        };
        dataArray.push({
          ...data,
          '': data
        });
      });

      // Sort by LastModifiedOn
      dataArray = dataArray.sort(
        (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
      );

      dispatch({ type: SATELLITE__SET_SATELLITE, data: dataArray });
    } catch (err) {
      console.error({ err });;
      NotificationManager.error('Error occurred while fetching Satellites.');
    }
    dispatch({ type: SATELLITE__STOP_SATELLITE_LOADING });
  };
}

export function addSatellite(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const projectDetails = getState().projectDetails.details;

      const satellite = {
        ...values,
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectDocumentID: projectDetails.uid,
        IsDelete: false
      };

      await fireStore.collection('Satellite').add(satellite);
      NotificationManager.success('New satellite added successfully');

      // Close the form
      dispatch(setIsFormOpenSatellite(false));

      dispatch(getSatellites());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error('Error occurred while adding new satellite.');
      setSubmitting(false);
    }
  };
}

export function deleteSatellite(index) {
  return async (dispatch, getState) => {
    dispatch({ type: SATELLITE__DISABLE_DELETE_DIALOG });
    try {
      const satellite = getState().satellites.satellites[index];
      const projectDetails = getState().projectDetails.details;

      const componentCount = await ComponentApi.getComponentsBySatelliteId(
        satellite.uid,
        projectDetails
      );
      if (componentCount > 0) {
        NotificationManager.error('Cannot Delete The Satellite');
      } else {
        const docRef = fireStore.collection('Satellite').doc(satellite.uid);
        await docRef.update({
          IsDelete: true
        });

        NotificationManager.success('Satellite deleted successfully.');

        // Close the delete dialog
        dispatch(setIsDeleteDialogOpenSatellite(false));

        // Reload the projects
        dispatch(getSatellites());
      }
    } catch (err) {
      console.error({ err });;
      NotificationManager.error('Error occurred while deleting the project.');
    }
    dispatch({ type: SATELLITE__ENABLE_DELETE_DIALOG });
  };
}

export function updateSatellite(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const collectionRef = fireStore.collection('Component');
      const projectDetails = getState().projectDetails.details;
      const satelliteId = getState().satellites.editFormData.uid;

      const docRef = fireStore.collection('Satellite').doc(satelliteId);
      await docRef.update({
        ...values,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date()
      });

      let components = await collectionRef
        .where('IsDeleted', '==', false)
        .where('ProjectId', '==', projectDetails.uid)
        .get();

      components.forEach(async componentDoc => {
        if (componentDoc && componentDoc.data()) {
          if (componentDoc.data().SatelliteId === satelliteId) {
            await collectionRef.doc(componentDoc.data().DocumentId).update({
              SatelliteName: values.SatelliteName,
              LastModifiedBy: userData.Email,
              LastModifiedOn: new Date()
            });
          }
        }
      });

      NotificationManager.success('Satellite updated successfully.');

      // Close the form
      dispatch(setIsFormOpenSatellite(false));

      // Reload the project
      dispatch(getSatellites());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error('Error occurred while updating the Satellite.');
      setSubmitting(false);
    }
  };
}

export function setIsFormOpenSatellite(data) {
  return async dispatch => {
    dispatch({ type: SATELLITE__SET_IS_FORM_OPEN, data });
  };
}

export function setFormTypeSatellite(data) {
  return async dispatch => {
    dispatch({ type: SATELLITE__SET_FORM_TYPE, data });
  };
}

export function setEditFormDataSatellite(data) {
  return async dispatch => {
    dispatch({ type: SATELLITE__SET_EDIT_FORM_DATA, data });
  };
}

export function setIsDeleteDialogOpenSatellite(data) {
  return async dispatch => {
    dispatch({ type: SATELLITE__SET_IS_DELETE_DIALOG_OPEN, data });
  };
}
