import produce from "immer";
import {
    GROUNDSTATION_IS_ADD_DIALOG_OPEN,
    GROUNDSTATION_IS_VIEW_DIALOG_OPEN,
    SET_GROUNDSTATION_LIST,
    ADD_NEW_GROUNDSTATION_ITEM,
    UPDATE_GROUNDSTATION_ITEM,
    DELETE_GROUNDSTATION_ITEM,
    RESET_GROUNDSTATION_LIST,
} from "../actions/types";

const initState = {
    isGroundstationAddFormOpen: false,
    isGroundstationViewFormOpen: false,
    GroundStationCollection: [],
};


export default (state = initState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case GROUNDSTATION_IS_ADD_DIALOG_OPEN: {
                draft.isGroundstationAddFormOpen = action.payload.isopen;
                break;
            }
            case GROUNDSTATION_IS_VIEW_DIALOG_OPEN: {
                draft.isGroundstationViewFormOpen = action.payload.isopen;
                break;
            }
            case SET_GROUNDSTATION_LIST: {
                draft.GroundStationCollection = action.payload;
                break;
            }
            case ADD_NEW_GROUNDSTATION_ITEM: {
                draft.GroundStationCollection.push(action.payload);
                break;
            }
            case UPDATE_GROUNDSTATION_ITEM: {
                const index = draft.GroundStationCollection.findIndex(
                    (ele) => ele.id === action.payload.id
                );
                if (index > -1) {
                    draft.GroundStationCollection[index] = action.payload;
                }
                break;
            }
            case DELETE_GROUNDSTATION_ITEM: {
                const index = draft.GroundStationCollection.findIndex(
                    (ele) => ele.id === action.payload.id
                );
                if (index > -1) {
                    draft.GroundStationCollection.splice(index, 1);
                }
                break;
            }
            case RESET_GROUNDSTATION_LIST: {
                draft.GroundStationCollection = [];
                draft.isGroundstationAddFormOpen = false;
                draft.isGroundstationViewFormOpen = false
                break;
            }
        }
    })
}