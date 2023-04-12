import {
  SET_ANALYSIS_COLLECTION,
  ADD_NEW_ANALYSIS_COLLECTION,
  MODIFY_ANALYSIS_COLLECTION,
  REMOVE_ANALYSIS_COLLECTION,
  RESET_ANALYSIS_COLLECTION,
} from "./types";

export const setAnalysisCollection = (data) => ({
  type: SET_ANALYSIS_COLLECTION,
  payload: data,
});

export const addNewAnalysisCollection = (data) => ({
  type: ADD_NEW_ANALYSIS_COLLECTION,
  payload: data,
});

export const modifyAnalysisCollection = (data) => ({
  type: MODIFY_ANALYSIS_COLLECTION,
  payload: data,
});

export const removeAnalysisCollection = (data) => ({
  type: REMOVE_ANALYSIS_COLLECTION,
  payload: data,
});

export const resetAnalysisCollection = () => ({
  type: RESET_ANALYSIS_COLLECTION,
});
