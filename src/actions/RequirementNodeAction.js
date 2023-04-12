import firebase, { auth, fireStore } from "../firebase";
import { NotificationManager } from "react-notifications";
import { setDocumentAtRef } from "../firebase/firestore";

// Add Action Here
import {
    REQUIREMENTSNODE_SET_SELECTED_NODE,
    REQUIREMENTSNODE_UPDATE_VALUE,
    REQUIREMENTSNODE_SET_SELECTED_NODE_VIEW
} from "./types";

export function currentSelected(data) {
  return async (dispatch, getState) => {     
    dispatch({ type: REQUIREMENTSNODE_SET_SELECTED_NODE,data:data });
  };
}


export function updateRequirementTypeselection(data) {
  return async (dispatch, getState) => {     
    dispatch({ type: REQUIREMENTSNODE_UPDATE_VALUE,data:data });
  };
}

export function currentSelectedView(data) {
  return async (dispatch, getState) => {    
    
    console.log(getState())
    dispatch({ type: REQUIREMENTSNODE_SET_SELECTED_NODE_VIEW,data:data });
  };
}


