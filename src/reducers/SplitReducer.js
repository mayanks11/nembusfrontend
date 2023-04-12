import { SET_MAX, SET_MIN, SET_LOCK, SET_EXPAND, SET_WINDOW_COLLAPSE, SET_NEMBUS_PROJECT_WIDTHCHANGED } from '../actions/types';
import produce from "immer";

/**
 * Split Simulation
 * Reducer
 * Nirmalya Saha
 */
const INIT_STATE = {
    pane1: {
        max: false,
        min: false,
        lock: false,
        collapse: true
    },
    pane2: {
        max: false,
        min: false,
        lock: false,
        collapse: false
    },
    pane3: {
        max: false,
        min: false,
        lock: false,
        collapse: false
    },
    pane4: {
        windowCollapse: true
    },
    nembusProjectAnalysis: {
        widthChanged: 0
    },
    loading: false
};

export default (state = INIT_STATE, action) => {
	return produce(state, (draft) => {
	  switch (action.type) {
        case SET_MAX:
            if(action.payload.value === "pane1"){
                draft.pane1.max = action.payload.trigger;
            } 
            else if(action.payload.value === "pane2"){
                draft.pane2.max = action.payload.trigger;
            }
            else{
                draft.pane3.max = action.payload.trigger;
            }
            draft.loading = !draft.loading;
        break;
        case SET_MIN:
            if(action.payload.value === "pane1"){
                draft.pane1.min = action.payload.trigger;
            } 
            else if(action.payload.value === "pane2"){
                draft.pane2.min = action.payload.trigger;
            }
            else{
                draft.pane3.min = action.payload.trigger;
            }
            draft.loading = !draft.loading;
        break;
        case SET_LOCK:
            if(action.payload.value === "pane1"){
                draft.pane1.lock = action.payload.trigger;
            } 
            else if(action.payload.value === "pane2"){
                draft.pane2.lock = action.payload.trigger;
            }
            else{
                draft.pane3.lock = action.payload.trigger;
            }
            draft.loading = !draft.loading;
        break;
        case SET_EXPAND:
            if(action.payload.value === "pane1"){
                draft.pane1.collapse = action.payload.trigger;
            } 
            else if(action.payload.value === "pane2"){
                draft.pane2.collapse = action.payload.trigger;
            }
            else{
                draft.pane3.collapse = action.payload.trigger;
            }
            draft.loading = !draft.loading;
        break;
        case SET_WINDOW_COLLAPSE:
            draft.pane4.windowCollapse = action.payload.trigger;
            draft.loading = !draft.loading;
        break;
        case SET_NEMBUS_PROJECT_WIDTHCHANGED:
            draft.nembusProjectAnalysis.widthChanged = action.payload;
            draft.loading = !draft.loading;
        break;
	  }
	});
};
