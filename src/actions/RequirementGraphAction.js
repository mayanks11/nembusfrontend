import firebase, { auth, fireStore } from "../firebase";
import { NotificationManager } from "react-notifications";
import { setDocumentAtRef } from "../firebase/firestore";

// Add Action Here
import {
  REQUIREMENTSGRAPH_START_REQUIREMENTSGRAPH_LOADING,
  REQUIREMENTSGRAPH__SET_REQUIREMENTSGRAPH,
  REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING,
  REQUIREMENTSGRAPH__ADDNODE_REQUIREMENTSGRAPH,
  REQUIREMENTSNODE_UPDATE_ADD_BUTTON
} from "./types";


export function getRequirementsGraph() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSGRAPH_START_REQUIREMENTSGRAPH_LOADING });
    try {
      await fireStore.runTransaction(async (transaction) => {
        const projectDetails = getState().projectDetails.details;

        const projectid = projectDetails.uid;
        const requirement_graph_id = projectDetails.RequirmentGraphid;

        const requirement_ref = fireStore
        .collection("PROJECT")
        .doc(projectid)
        .collection("RequirementGraph")
        .doc(requirement_graph_id);

        const response = await requirement_ref.get();

        if (response)
        {
          const requirementGraph=(JSON.parse(response.data()['reguirementgraph']))
          dispatch({
            type: REQUIREMENTSGRAPH__SET_REQUIREMENTSGRAPH,
            data: requirementGraph,
          });

          console.log("requirementGraph",requirementGraph)
        }


      });

      
    } catch (error) {
      console.error({ error });
      NotificationManager.error(
        "Error occurred while fetching Requirement graph."
      );
    }

    dispatch({ type: REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING });
  };
}

export function addNodeInRequirementGraph(node) {
  return async (dispatch, getState) => {
    
    try {
      
      dispatch({ type: REQUIREMENTSGRAPH__ADDNODE_REQUIREMENTSGRAPH,data:node });


      
    } catch (error) {
      console.error({ error });
      NotificationManager.error(
        "Error occurred while fetching Requirement graph."
      );
    }

    dispatch({ type: REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING });
  };
}

export function updateRequirementAddButton(node) {
  return async (dispatch, getState) => {
    
    try {
      
      dispatch({ type: REQUIREMENTSNODE_UPDATE_ADD_BUTTON,data:node });


      
    } catch (error) {
      console.error({ error });
      NotificationManager.error(
        "Error occurred while fetching Requirement graph."
      );
    }

    
  };
}





