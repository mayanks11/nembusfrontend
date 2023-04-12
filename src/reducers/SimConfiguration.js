import produce from "immer";

import {
    SET_SIM_CONFIGURATION,
    UPDATE_SIM_CONFIGURATION,
    IS_CONFIGURATION_SAVED,

} from "../actions/types";

import {get} from 'lodash'

const initState = {
  parameters: {},
  createdAt: -1,
  simRate: {},
  simulationfile: "",
  is3DVisualization: false,
  id:"",
  version:0,
  isLoaded: false,
  isSaved:true,
  numberofUpdate:0
};

export default (state = initState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
        case SET_SIM_CONFIGURATION:{
            
            console.log("SET_SIM_CONFIGURATION action",action.payload)
            draft.parameters=action.payload.parameters;
            draft.createdAt=action.payload.createdAt;
            draft.simRate=action.payload.simRate;
            draft.simulationfile=get(action.payload,'simulationfile',"");
            draft.is3DVisualization=get(action.payload,'is3DVisualization',false);
            draft.id=get(action.payload,'id',false);
            draft.version=get(action.payload,'version',0);
            draft.isLoaded= true
            draft.numberofUpdate = draft.numberofUpdate+1

        break;
        }


    }
  });
};
