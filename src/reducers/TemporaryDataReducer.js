/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    EXTRA_DATA__SET_TEMP_DATA,
    EXTRA_DATA__SET_USER_DATA
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    user: {}
};

export default (state = INIT_STATE, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case EXTRA_DATA__SET_TEMP_DATA:
                draft.data = action.data;
                break;
            case EXTRA_DATA__SET_USER_DATA:
                draft.user = action.data;
                break;
        }
    });
};
