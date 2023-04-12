import { NotificationManager } from "react-notifications";
import {
  SIMULATION_ENGINE_UPDATE_STATUS,
  EXPECTED_SIMULATION_ENGINE_UPDATE_STATUS,
  UPDATE_SIMULATION_PROGRESS_STATUS,
  ADD_SIMULATION_ERROR_RESULT,
  RESET_SIMULATION_ERROR_RESULT,
} from "./types";

import moment from "moment";

import {runSimulationCompleted} from './Simulate';

export function updateEngineStatus(data) {
  return async (dispatch, getState) => {
    try {

      dispatch({ type: SIMULATION_ENGINE_UPDATE_STATUS, data: data });

      if(data["status"] ==="Error" || data["status"] ==="Completed"){
        dispatch(runSimulationCompleted())
      }
    } catch (err) {
      // console.error({ err });;
      NotificationManager.error("Error occurred while fetching Simulations.");
    }
  };
}

export function updateExpectedStatus(data) {
  return async (dispatch, getState) => {
    try {
      
      dispatch({ type: EXPECTED_SIMULATION_ENGINE_UPDATE_STATUS, data: data });
    } catch (err) {
      console.error({ err });;
      NotificationManager.error("Error occurred while fetching Simulations.");
    }
  };
}

export function updateSimProgressStatus(data) {
  return async (dispatch, getState) => {
    try {
     
      dispatch({ type: UPDATE_SIMULATION_PROGRESS_STATUS, data: data });
      if(data["status"] ==="Error" || data["status"] ==="COMPLETED"){
        dispatch(runSimulationCompleted())
      }
    } catch (err) {
      console.error({ err });;
      NotificationManager.error("Error occurred while fetching Simulations.");
    }
  };

  
}

export function addErrorMessage(data){
    return async (dispatch, getState) => {
        try {
       
          dispatch({ type: ADD_SIMULATION_ERROR_RESULT, data: data });
        } catch (err) {
          console.error({ err });;
          NotificationManager.error("Error occurred while fetching Simulations.");
        }
      };
      
}

export function resetErrorMessage(){
    return async (dispatch, getState) => {
        try {
        
          dispatch({ type: RESET_SIMULATION_ERROR_RESULT});
        } catch (err) {
          console.error({ err });;
          NotificationManager.error("Error occurred while fetching Simulations.");
        }
      };
      
}

