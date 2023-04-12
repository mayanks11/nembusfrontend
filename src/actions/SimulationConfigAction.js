import {
    SET_SIMULATION_CONFIG_SELECT_BLOCK,
    SET_BLOCK_NAME_SELECT_BLOCK,
    SET_BLOCK_SIMULATION_TIME_SELECT_BLOCK,
    SET_IS_UPDATE_BLOCK_CONFIG,
    SET_BLOCK_PARAM_CONFIG
} from './types';


export const setSimulationConfigSelect = (data) => ({
    type: SET_SIMULATION_CONFIG_SELECT_BLOCK,
    payload: {...data}
    
});

export const setBlockNameOfSelectConfig = (blockName)=> (
    {
    type: SET_BLOCK_NAME_SELECT_BLOCK,
    payload: {'blockName': blockName}
    }
);

export const setBlockSimulationTime = (simulationTime)=> (
    {
    type: SET_BLOCK_SIMULATION_TIME_SELECT_BLOCK,
    payload: {'simulationTime': simulationTime}
    }
);

export const setIsUpdateBlock =(isUpdateblock)=>(
    {
        type: SET_IS_UPDATE_BLOCK_CONFIG,
        payload:{'isupdate':isUpdateblock}
    }
);

export const setBlockParam =(param)=>(
    {
        type: SET_BLOCK_PARAM_CONFIG,
        payload:{'param':param}
    }
);