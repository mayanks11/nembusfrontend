import produce from "immer";
import {
  SET_ANALYSIS_COLLECTION,
  ADD_NEW_ANALYSIS_COLLECTION,
  MODIFY_ANALYSIS_COLLECTION,
  REMOVE_ANALYSIS_COLLECTION,
  RESET_ANALYSIS_COLLECTION,
} from "../actions/types";

const initState = {
  simulationAnalysisCollection: [],
  isAddedNewtoggle: 0,
  idAdded: "",
  isModifytoggele: 0,
  idModified: "",
  isRemovedtoggel: 0,
  idRemoved: "",
};

export default (state = initState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SET_ANALYSIS_COLLECTION: {
        draft.simulationAnalysisCollection = action.payload;

        break;
      }
      case ADD_NEW_ANALYSIS_COLLECTION: {
        draft.simulationAnalysisCollection.push(action.payload);
        draft.isAddedNewtoggle = draft.isAddedNewtoggle + 1;
        draft.idAdded = action.payload.id;
        break;
      }
      case MODIFY_ANALYSIS_COLLECTION: {
        const index = draft.simulationAnalysisCollection.findIndex(
          (ele) => ele.id === action.payload.id
        );
        if (index > -1) {
          // draft.simulationAnalysisCollection.splice(index, 1);
          // draft.simulationAnalysisCollection.splice(index, 0,action.payload);
          draft.simulationAnalysisCollection[index] = action.payload;
          draft.isModifytoggele = draft.isModifytoggele + 1;
          draft.idModified = action.payload.id;
        }
        break;
      }
      case REMOVE_ANALYSIS_COLLECTION: {
        const index = draft.simulationAnalysisCollection.findIndex(
          (ele) => ele.id === action.payload.id
        );
        if (index > -1) {
          draft.simulationAnalysisCollection.splice(index, 1);
          draft.isRemovedtoggel = draft.isRemovedtoggel + 1;
          draft.idRemoved = action.payload.id;
        }
        break;
      }
      case RESET_ANALYSIS_COLLECTION: {
        draft.simulationAnalysisCollection = [];
        draft.isAddedNewtoggle = 0;
        draft.idAdded = "";
        draft.isModifytoggele = 0;
        draft.idModified = "";
        draft.isRemovedtoggel = 0;
        draft.idRemoved = "";
      }
    }
  });
};
