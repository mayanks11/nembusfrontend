import produce from "immer";
import {
    SET_REALTIME_PARAMETER_ID
}
    from "../actions/types";
import { nanoid } from 'nanoid'; 

const initState = {
    parameterId : null,

};

export default (state = initState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case SET_REALTIME_PARAMETER_ID: {
                console.log("SET_REALTIME_PARAMETER_ID", action.data);
                draft.parameterId = action.data;
                break;
            }
            
        }
    });
};