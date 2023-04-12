import produce from "immer";
import { SET_START_TOUR, SET_END_TOUR } from "../actions/types";

const initState = {
  isTourRunning: false,
};

export default (state = initState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SET_START_TOUR: {
        //   console.log("inside start tour ");
        draft.isTourRunning = true;
        break;
      }
      case SET_END_TOUR: {
        draft.isTourRunning = false;
        break;
      }
    }
  });
};
