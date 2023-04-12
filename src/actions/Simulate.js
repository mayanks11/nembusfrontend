import {
  SIMULATE_CHANGE_SIMPLE,
  SIMULATE_CHANGE_TAB,
  SIMULATE_CHANGE_AXIS,
  SIMULATE_CHANGE_UNIT,
  SIMULATE_CHANGE_LEFTPANEL,
  SIMULATE_CHANGE_SAVE,
  SIMULATE_RUN,
  CREATE_SIMULATION_SUCCESS,
  SAVE_CZML_DATA,
  INIT_SOCKET,
  CLOSE_SOCKET,
  SET_PROJECT,
  CLEAR_PROJECT,
  SET_CASE,
  CLEAR_CASE,
  SET_OLD_CASE,
  SET_PARAMETERS,
  FIRE_EVENT,
  SET_STATUS,
  CLEAR_PARAMETER,
  SET_SIMULATION_CONFIG_LIST,
  SET_RUN_SIMULATION_CONFIG_LIST,
  SET_NEW_CONFIG_OBJECT,
  CLEAR_SIMULATION_CONFIG_LIST,
  CLEAR_RUN_SIMULATION_CONFIG_LIST,
  SET_RUN_SIMULATION_CONFIG_LIST_LOADING,
  SET_SIMULATION_CONFIG_ACTIVE,
  CLEAR_SIMULATION_CONFIG_ACTIVE,
  SET_SELECT_SIMULATION_CONFIG,
  CLEAR_SELECT_SIMULATION_CONFIG,
  SET_IS_PAGE_LOADING,
  SET_SIMULATION_CONFIG_RATE
} from "./types";

import _ from "lodash";

import { getPubSubOffSetValue } from "../api/PubSubMessager";

// const SOCKET_ENDPOINT = 'https://kafka2websocket.appspot.com';
// const SOCKET_ENDPOINT = 'https://react-project-1555f.el.r.appspot.com';

// const SOCKET_ENDPOINT = 'https://lepos.serveo.net';
// const SOCKET_ENDPOINT = 'http://localhost:8080';
// const SOCKET_ENDPOINT = 'http://192.168.18.22:3001';
const SOCKET_ENDPOINT ="https://satpass-dot-react-project-1555f.el.r.appspot.com";
// const SOCKET_ENDPOINT = 'http://192.168.86.110:8090';

import ParameterService from "../api/Parameter";

export const changeTab = (value) => ({
  type: SIMULATE_CHANGE_TAB,
  payload: value,
});

export const changeSimple = (path, value) => ({
  type: SIMULATE_CHANGE_SIMPLE,
  payload: { path, value },
});

export const changeAxis = (which, value) => ({
  type: SIMULATE_CHANGE_AXIS,
  payload: {
    which,
    value,
  },
});

export const changeUnit = (which, value) => ({
  type: SIMULATE_CHANGE_UNIT,
  payload: {
    which,
    value,
  },
});
export const toggleSimulateLeftPanel = (value) => ({
  type: SIMULATE_CHANGE_LEFTPANEL,
  payload: value,
});

export const createSimulation = (data) => async (dispatch) => {
  try {
    const result = await ParameterService.create(data);
    await dispatch({ type: CREATE_SIMULATION_SUCCESS });
    console.log("parameter create response : ", result);
  } catch (err) {
    console.log("parameter create error : ", err);
  }
};

export const setProject = (data) => ({
  type: SET_PROJECT,
  payload: data,
});

export const clearProject = () => ({
  type: CLEAR_PROJECT,
});

export const setCase = (data) => ({
  type: SET_CASE,
  payload: data,
});

export const clearCase = () => ({
  type: CLEAR_CASE,
});

export const setOldCase = (data) => ({
  type: SET_OLD_CASE,
  payload: data,
});
export const clearParameter = () => ({
  type: CLEAR_PARAMETER,
});

export const setParameters = (data) => ({
  type: SET_PARAMETERS,
  payload: data,
});
export const setIsLoading =(isLoading) =>(
  {
      type: SET_IS_PAGE_LOADING,
      payload:{isLoading}
  }
)
export const setSimulationRate =(data) =>({
  type:SET_SIMULATION_CONFIG_RATE,
  payload:data
})

export const saveCzmlData = (data) => ({ type: SAVE_CZML_DATA, payload: data });

// export const initSocket = (uid) => ({

//     type: INIT_SOCKET,
//     payload: {url:SOCKET_ENDPOINT,uid:uid,consumerGroup:'my_group'} //
// });

export function initSocket(uid) {
  return async (dispatch, getState) => {
    try {
      const pubsubOffSetList = await getPubSubOffSetValue(uid);
      let czml_offset = 0;
      let plotgraph_offset = 0;
      let simulationstatus_offset = 0;
      if (!_.isEmpty(pubsubOffSetList)) {
        czml_offset = pubsubOffSetList["czml"];
        plotgraph_offset = pubsubOffSetList["plotgraph"];
        simulationstatus_offset = pubsubOffSetList["simulationstatus"];
      }

      dispatch({
        type: INIT_SOCKET,
        payload: {
          url: SOCKET_ENDPOINT,
          uid: uid,
          consumerGroup: "my_group",
          czml_offset: czml_offset+1,
          plotgraph_offset: plotgraph_offset+1,
          simulationstatus_offset: simulationstatus_offset+1,
        },
      });
    } catch (err) {
      console.error({ err });;
    }
  };
}

export const closeSocket = () => ({
  type: CLOSE_SOCKET,
});

export const fireEvent = (name, args) => ({
  type: FIRE_EVENT,
  payload: {
    name,
    args,
  },
});
export const setNewConfigObject=(data)=>({
  type: SET_NEW_CONFIG_OBJECT,
  payload:data
})

export const setSimulationStatus = (data) => ({
  type: SET_STATUS,
  payload: data,
});
export const saveSimulation = (data) => ({
  type: SIMULATE_CHANGE_SAVE,
  payload: data,
});
export const runSimulation = (data) => ({
  type: SIMULATE_RUN,
  payload: data,
});
export const saveSimulationCompleted = () => ({
  type: SIMULATE_CHANGE_SAVE,
  payload: false,
});
export const runSimulationCompleted = () => ({
  type: SIMULATE_RUN,
  payload: false,
});
export const setSimulationConfigList = (data) => ({
  type: SET_SIMULATION_CONFIG_LIST,
  payload: { ...data },
});
export const setRunSimulationConfigList =(data) =>({
  type:SET_RUN_SIMULATION_CONFIG_LIST,
  payload:data,
})
export const clearSimulationConfigList = () => ({
  type: CLEAR_SIMULATION_CONFIG_LIST,
});
export const clearRunSimulationConfigList = () => ({
  type: CLEAR_RUN_SIMULATION_CONFIG_LIST,
});
export const setSimulationActiveConfig = (data) => ({
  type: SET_SIMULATION_CONFIG_ACTIVE,
  payload: data,
});
export const setLoadingOfRunConfiguration = (data) =>({
  type:SET_RUN_SIMULATION_CONFIG_LIST_LOADING,
  payload: data
});
export const clearSimulationActiveConfig = (data) => ({
  type: CLEAR_SIMULATION_CONFIG_ACTIVE,
  payload: data,
});
export const setSelectSimulationConfig = (data) => ({
  type: SET_SELECT_SIMULATION_CONFIG,
  payload: { ...data },
});
export const clearSelectSimulationConfig = () => ({
  type: CLEAR_SELECT_SIMULATION_CONFIG,
});
