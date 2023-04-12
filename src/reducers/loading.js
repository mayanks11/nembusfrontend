/**
 * Auth User Reducers
 */

import produce from "immer";
import {
  PORTION_LOADED,
  PORTION_LOADING,
  OVERLAY_LOADED,
  OVERLAY_LOADING
} from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  portion: false,
  overlay: false
};

export default (state = INIT_STATE, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case PORTION_LOADING:
        draft.portion = true;
        break;
      case PORTION_LOADED:
        draft.portion = false;
        break;
      case OVERLAY_LOADING:
        draft.overlay = true;
        break;
      case OVERLAY_LOADED:
        draft.overlay = false;
        break;
    }
  });
};
