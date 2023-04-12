import {
  SET_SIM_CONFIGURATION,
  UPDATE_SIM_CONFIGURATION,
  IS_CONFIGURATION_SAVED,
} from "./types";

// export const setSimulationConfiguration = (data) => {

//   return({
//     type: SET_SIM_CONFIGURATION,
//     payload: data,
//   })};

export function setSimulationConfiguration(data) {
  return async (dispatch, getState) => {
    console.log("SET_SIM_CONFIGURATION", data);
    try {
      dispatch({ type: SET_SIM_CONFIGURATION, payload: data });
    } catch (err) {
      console.error({ err });
    }
  };
}

export const updateSimConfiguration = (data) => ({
  type: UPDATE_SIM_CONFIGURATION,
  payload: data,
});

export const IsSimConfigurationSaved = (data) => ({
  type: IS_CONFIGURATION_SAVED,
  payload: data,
});
