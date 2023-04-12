import produce from "immer";
import moment from "moment";

import dagre from "dagre";
import { isEmpty, get } from "lodash";

import {
  SIMULATION_ENGINE_UPDATE_STATUS,
  EXPECTED_SIMULATION_ENGINE_UPDATE_STATUS,
  UPDATE_SIMULATION_PROGRESS_STATUS,
  ADD_SIMULATION_ERROR_RESULT,
  RESET_SIMULATION_ERROR_RESULT

} from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  current_engine_states: {
    epoch: moment().valueOf(),
    status: "Not Working",
    erorr_message: [],
    simulation_done : -1,
    running_info: {
      project_id: null,
      project_name: null,
      simulation_id: null,
      simulation_name: null,
      configuration_name: null,
      configuration_id: null,
      runid: null,
    },
  },
  previous_engine_state: {},
  expected_simulation_state: {
    epoch: -1,
    running_info: {
      project_id: null,
      project_name: null,
      simulation_id: null,
      simulation_name: null,
      configuration_name: null,
      configuration_id: null,
      runid: null,
    },
  },
};

export default (state = INIT_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SIMULATION_ENGINE_UPDATE_STATUS: {
        
        draft.current_engine_states.status = action.data["status"];
        draft.current_engine_states.epoch = action.data["epoch"];
        if (!isEmpty(action.data["information"])) {
          draft.current_engine_states.running_info.project_name = get(
            action.data["information"],
            ["project_name"],
            ""
          );
          draft.current_engine_states.running_info.project_id = get(
            action.data["information"],
            ["project_id"],
            ""
          );
          draft.current_engine_states.running_info.simulation_name = get(
            action.data["information"],
            ["simulation_name"],
            ""
          );
          draft.current_engine_states.running_info.simulation_id = get(
            action.data["information"],
            ["simulation_id"],
            ""
          );
          draft.current_engine_states.running_info.configuration_name = get(
            action.data["information"],
            ["configuration_name"],
            ""
          );
          draft.current_engine_states.running_info.configuration_id = get(
            action.data["information"],
            ["configuration_id"],
            ""
          );
          draft.current_engine_states.running_info.runid = get(
            action.data["information"],
            ["runid"],
            ""
          );
        }

        break;
      }
      case EXPECTED_SIMULATION_ENGINE_UPDATE_STATUS: {
        
        draft.expected_simulation_state.epoch = action.data["epoch"];
        if (!isEmpty(action.data["information"])){
          draft.expected_simulation_state.running_info.project_name = get(
            action.data["information"],
            ["project_name"],
            ""
          );

          draft.expected_simulation_state.running_info.project_id = get(
            action.data["information"],
            ["project_id"],
            ""
          );
          draft.expected_simulation_state.running_info.simulation_name = get(
            action.data["information"],
            ["simulation_name"],
            ""
          );
          draft.expected_simulation_state.running_info.simulation_id = get(
            action.data["information"],
            ["simulation_id"],
            ""
          );
          draft.expected_simulation_state.running_info.configuration_name = get(
            action.data["information"],
            ["configuration_name"],
            ""
          );
          draft.expected_simulation_state.running_info.configuration_id = get(
            action.data["information"],
            ["configuration_id"],
            ""
          );

          draft.expected_simulation_state.running_info.runid = get(
            action.data["information"],
            ["runid"],
            ""
          );

          break;

        }

        
      }
      case UPDATE_SIMULATION_PROGRESS_STATUS: {

        
        draft.current_engine_states.status = action.data["status"];
        draft.current_engine_states.epoch = action.data["epoch"];
        draft.current_engine_states.simulation_done = action.data["simulation_done"];

        //Just to distinguish that this data will come from czml update only 
        if (!isEmpty(action.data["simulatioinfo"])) {
          draft.current_engine_states.running_info.project_name = get(
            action.data["simulatioinfo"],["Project Name"],
            ""
          );
          draft.current_engine_states.running_info.project_id = get(
            action.data["simulatioinfo"],
            ["Project id"],
            ""
          );
          draft.current_engine_states.running_info.simulation_name = get(
            action.data["simulatioinfo"],
            ["Simulation Name"],
            ""
          );
          draft.current_engine_states.running_info.simulation_id = get(
            action.data["simulatioinfo"],
            ["Simulation id"],
            ""
          );
          draft.current_engine_states.running_info.configuration_name = get(
            action.data["simulatioinfo"],
            ["configurations"],
            ""
          );
          draft.current_engine_states.running_info.configuration_id = get(
            action.data["simulatioinfo"],
            ["Parameter id"],
            ""
          );
          draft.current_engine_states.running_info.runid = get(
            action.data["simulatioinfo"],
            ["Runid"],
            ""
          );
        }
        
        break
      }
      case ADD_SIMULATION_ERROR_RESULT:{

        const message = action.data["error_message"]

        console.log("message enginee",message)

        message.forEach(element => {
          console.log("message enginee",element)
          draft.current_engine_states.erorr_message.push(element)
          // console.log("draft.current_engine_states.erorr_message enginee",draft.current_engine_states.erorr_message)
        });

        break;
      }

      case RESET_SIMULATION_ERROR_RESULT:{
        draft.current_engine_states.erorr_message.splice(0, draft.current_engine_states.erorr_message.length);
        break;

      }
    }
  });
};
