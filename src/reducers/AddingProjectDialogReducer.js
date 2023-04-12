import {IS_LOADING} from 'Actions/types';

const initialState = {
    isLoading: false
}

const SpinnerReducer = (state = initialState, action) => {
    switch(action.type) {
        case IS_LOADING:
            return {
                ...state,
                isLoading: !state.isLoading
            }

        default:
            return state;
    }
};

export default SpinnerReducer;