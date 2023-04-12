import { Map, fromJS, merge } from "immutable";
import {
  SET_SIMULATION_CONFIG_SELECT_BLOCK,
  SET_BLOCK_NAME_SELECT_BLOCK,
  SET_BLOCK_SIMULATION_TIME_SELECT_BLOCK,
  SET_IS_UPDATE_BLOCK_CONFIG,
  SET_BLOCK_PARAM_CONFIG,
  SET_NEW_CONFIG_OBJECT
} from "../actions/types";

const initState = fromJS({
  Selectedblock: {},
  isBlockUpdate: false,
  newConfigObject:{}
});
export default function(state = initState, action) {
  switch (action.type) {
    case SET_SIMULATION_CONFIG_SELECT_BLOCK: {
  
      const oldstate = state.get("Selectedblock");
      const newstate = state.set("Selectedblock", fromJS(action.payload));
    
      if (newstate.size > 0) {
     
      }
      return newstate;
    }
    case SET_BLOCK_NAME_SELECT_BLOCK: {
     
      return state.setIn(
        ["Selectedblock", "options", "extras", "blockType", "name"],
        action.payload.blockName
      );
    }
    case SET_BLOCK_SIMULATION_TIME_SELECT_BLOCK: {
      console.log("action.payload.simulationTime",action.payload.simulationTime)
     
      return state.setIn(
        ["Selectedblock", "options", "extras", "blockType", "datas","simulationdetail","updatingFrequency","value"],
        action.payload.simulationTime
      );
    }

    case SET_IS_UPDATE_BLOCK_CONFIG: {
      return state.set("isBlockUpdate", action.payload.isupdate);
    }

    case SET_BLOCK_PARAM_CONFIG: {

        console.log("SET_BLOCK_PARAM_CONFIG",action.payload.param);
      return state.setIn(
        ["Selectedblock", "options", "extras", "params"],
        fromJS(action.payload.param)
      );
    }
    case SET_NEW_CONFIG_OBJECT:{
      console.log("SET_NEW_CONFIG_OBJECT",action.payload)
      return state.set("newConfigObject",action.payload)
    }
    default: {
      return state;
    }
  }
}
