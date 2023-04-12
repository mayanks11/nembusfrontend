/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    PROJECT_DETAILS__SET,
    PROJECT_DETAILS__START_LOADING,
    PROJECT_DETAILS__STOP_LOADING,
    PROJECT_DETAILS__UPDATE_STAKEHOLDER
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    details: {},
    isLoading: true
};

export default (state = INIT_STATE, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case PROJECT_DETAILS__SET:
                draft.details = action.data;
                draft.isLoading = false;
                break;
            case PROJECT_DETAILS__START_LOADING:
                draft.isLoading = true;
                break;
            case PROJECT_DETAILS__STOP_LOADING:
                draft.isLoading = false;
                break;
            case PROJECT_DETAILS__UPDATE_STAKEHOLDER:
                draft.details.StackholderList[action.data.key] =
                    action.data.value;
                break;
        }
    });
};
