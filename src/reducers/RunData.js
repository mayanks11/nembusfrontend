import { LOAD_RUN_DATA, SET_RUN_DATA_LOADING } from '../actions/types';
import produce from "immer";

/**
 * Run Data Plot Analysis
 * Nirmalya Saha
 */
const INIT_STATE = {
    runData: null,
    isLoading: false
};

export default (state = INIT_STATE, action) => {
	return produce(state, (draft) => {
	  switch (action.type) {
        case LOAD_RUN_DATA :
            draft.runData = null;
            draft.runData = action.payload;
            draft.isLoading = false;
        break;
        case SET_RUN_DATA_LOADING: 
          draft.isLoading = action.payload;
        break;
	  }
	});
};
