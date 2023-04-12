import produce from 'immer';


import {
    SET_RUN_SIMULATION_CONFIG_LIST,
    CLEAR_RUN_SIMULATION_CONFIG_LIST,
    SET_RUN_SIMULATION_CONFIG_LIST_LOADING
} from '../actions/types';


const INIT_STATE = {
    simulationRunConfigList:[],
    isLoading:false

}


export default (state = INIT_STATE, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case SET_RUN_SIMULATION_CONFIG_LIST:
                draft.simulationRunConfigList = action.payload;
                break;

            case CLEAR_RUN_SIMULATION_CONFIG_LIST:
                draft.simulationRunConfigList=[]
                break;

            case SET_RUN_SIMULATION_CONFIG_LIST_LOADING:
                draft.isLoading= action.payload
                break;

        }
    });
};
