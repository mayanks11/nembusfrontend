import {
  PROJECT_DETAILS__SET,
  PROJECT_DETAILS__START_LOADING,
  PROJECT_DETAILS__STOP_LOADING,
  STAKEHOLDERS__START_STAKEHOLDERS_LOADING,
  PROJECT_DETAILS__UPDATE_STAKEHOLDER
} from './types';
import { get } from 'lodash';
import { getStakeholders } from './StakeholdersActions';
import { NotificationManager } from 'react-notifications';
import { fireStore, auth } from '../firebase';
import { getRequirements } from './RequirementsActions';
import { getWorkPackages } from './WorkPackageActions';
import { getTasks } from './TaskActions';
import { getFiles } from './FileActions';
import { getSatellites } from './SatelliteActions';
import { getSimulations } from './SimulationActions';
import {getRequirementsGraph} from './RequirementGraphAction'
import history from '../helpers/history';

export function setProjectDetails(data) {
  return async dispatch => {
    console.log("data-----------,",data)
    dispatch({ type: PROJECT_DETAILS__SET, data });
    dispatch(getStakeholders());
    dispatch(getRequirements());
    dispatch(getWorkPackages());
    dispatch(getRequirementsGraph());
    dispatch(getTasks());
    dispatch(getFiles());
    dispatch(getSatellites());
    dispatch(getSimulations());
  };
}

export function getProjectDetails(uid) {
  return async (dispatch, getState) => {
    dispatch({ type: PROJECT_DETAILS__START_LOADING });
    dispatch({ type: STAKEHOLDERS__START_STAKEHOLDERS_LOADING });
    try {
      
      const projectRef = fireStore.collection('PROJECT');
      const projectDetails = getState().projectDetails.details;
      const response = await projectRef.doc(uid).get();


      if (
        response.data() == undefined ||
        !response.data().StackholderList ||
        !response.data().StackholderList[auth.currentUser.uid] ||
        response.data().StackholderList[auth.currentUser.uid] == 'deleted'
      ) {
        history.push(`/app/systemengineering/missionlist`);

        setTimeout(() => {
          NotificationManager.error('No project found.');
        }, 3000);

        return;
      }

      dispatch(
        setProjectDetails({
          ...response.data(),
          uid
        })
      );
    } catch (err) {
      console.error({ err });;
      NotificationManager.error(
        'Error occurred while fetching project details.'
      );
      history.push(`/app/systemengineering/missionlist`);
    }
    dispatch({ type: PROJECT_DETAILS__STOP_LOADING });
  };
}


export function getProjectDetailsfresh({uid,projectid}) {
  return async (dispatch, getState) => {
    dispatch({ type: PROJECT_DETAILS__START_LOADING });
    dispatch({ type: STAKEHOLDERS__START_STAKEHOLDERS_LOADING });
    try {
      const projectRef = fireStore.collection('PROJECT');
      const projectDetails = getState().projectDetails.details;

      

      // If uid is undefined, get uid from redux state
      if (!uid) {
        uid = projectDetails.uid;
      }

      const response = await projectRef.doc(uid).get();

      if (
        response.data() == undefined ||
        !response.data().StackholderList ||
        !response.data().StackholderList[auth.currentUser.uid] ||
        response.data().StackholderList[auth.currentUser.uid] == 'deleted'
      ) {
        history.push(`/app/systemengineering/missionlist`);

        setTimeout(() => {
          NotificationManager.error('No project found.');
        }, 3000);

        return;
      }

      dispatch(
        setProjectDetails({
          ...response.data(),
          uid
        })
      );
    } catch (err) {
      console.error({ err });;
      NotificationManager.error(
        'Error occurred while fetching project details.'
      );
      history.push(`/app/systemengineering/missionlist`);
    }
    dispatch({ type: PROJECT_DETAILS__STOP_LOADING });
  };
}



export function updateStakeholderMap(data) {
  return async (dispatch, getState) => {
    dispatch({
      type: PROJECT_DETAILS__UPDATE_STAKEHOLDER,
      data
    });
  };
}
