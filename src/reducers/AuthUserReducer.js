/**
 * Auth User Reducers
 */
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    PROCEED_TO_UPDATE_PASSWORD,
    PASSWORD_RESET_SUCCESS,
    RESET_FORGOT_PASSWORD_STATE,
    PASSWORD_RESET_ERROR,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE
} from 'Actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    user: localStorage.getItem('user_id'),
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOGIN_USER:
            return { ...state, loading: true };

        case LOGIN_USER_SUCCESS:
        
            return { ...state, loading: false, user: action.payload };

        case LOGIN_USER_FAILURE:
            return { ...state, loading: false };

        case LOGOUT_USER:
            return { ...state, user: null };
        
        case PROCEED_TO_UPDATE_PASSWORD:
            return { ...state, forgotPassword: "enterOtp"}

        case PASSWORD_RESET_SUCCESS:
            return { ...state, forgotPassword: "success"}

        case PASSWORD_RESET_ERROR:
            return { ...state, forgotPassword: 'error' }

        case RESET_FORGOT_PASSWORD_STATE:
            return { ...state, forgotPassword: null}

        case SIGNUP_USER:
            return { ...state, loading: true };

        case SIGNUP_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload };

        case SIGNUP_USER_FAILURE:
            return { ...state, loading: false };

        default: return { ...state };
    }
}
