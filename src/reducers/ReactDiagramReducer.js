import { fromJS, merge, List, Map } from "immutable";
import {SET_PROPAGATOR_COUNT} from '../actions/types';

const initState = fromJS({
    propagatorCount :0
});

export default function(state = initState, action) {
    switch (action.type) {
        case SET_PROPAGATOR_COUNT:{
            return state.set('propagatorCount',action.payload);
        }
        default: {
            return state;
        }
    }
}