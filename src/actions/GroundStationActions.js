import {
    SET_GROUNDSTATION_LIST,
    ADD_NEW_GROUNDSTATION_ITEM,
    UPDATE_GROUNDSTATION_ITEM,
    DELETE_GROUNDSTATION_ITEM,
    RESET_GROUNDSTATION_LIST,
    GROUNDSTATION_IS_ADD_DIALOG_OPEN,
    GROUNDSTATION_IS_VIEW_DIALOG_OPEN
} from "./types";

export const setGroundStationList = (data) => ({
    type: SET_GROUNDSTATION_LIST,
    payload: data
})

export const addNewGroundStationItem = (data) => ({
    type: ADD_NEW_GROUNDSTATION_ITEM,
    payload: data
})

export const updateGroundStationItem = (data) => ({
    type: UPDATE_GROUNDSTATION_ITEM,
    payload: data
})

export const deleteGroundStationItem = (data) => ({
    type: DELETE_GROUNDSTATION_ITEM,
    payload: data
})

export const resetGroundStationList = () => ({
    type: RESET_GROUNDSTATION_LIST,
})

export const setGroundstationAddDialogBox = (isopen) => ({
    type: GROUNDSTATION_IS_ADD_DIALOG_OPEN,
    payload: { "isopen": isopen },
});

export const setGroundstationViewDialogBox = (isopen) => ({
    type: GROUNDSTATION_IS_VIEW_DIALOG_OPEN,
    payload: { "isopen": isopen }
});