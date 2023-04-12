import {
  // GROUNDSTATION_IS_ADD_DIALOG_OPEN,
  // GROUNDSTATION_IS_VIEW_DIALOG_OPEN,
  GROUNDSTATION_ADD_STATION_LIST,
  GROUNDSTATION_UPDATE_STATION_LIST,
  GROUNDSTATION_UPDATE_STATION_ITEM,
  GROUNDSTATION_DELETE_STATION_LIST_ROW,
  GROUNDSTATION_CLEAR_STATION_LIST
} from "./types";

// export const setGroundstationAddDialogBox = (isopen) => ({
//   type: GROUNDSTATION_IS_ADD_DIALOG_OPEN,
//   payload: { "isopen": isopen },
// });

// export const setGroundstationViewDialogBox = (isopen) => ({

//     type:GROUNDSTATION_IS_VIEW_DIALOG_OPEN,
//     payload: { "isopen": isopen }
// });

export const setGroundstationList = (data) => ({

  type: GROUNDSTATION_ADD_STATION_LIST,
  payload: { "data": { ...data } }
});

export const updateGroundstationItem = (data, key) => ({

  type: GROUNDSTATION_UPDATE_STATION_ITEM,
  payload: { "data": { ...data }, "key": key }
});

export const updateGroundstationList = (data) => ({

  type: GROUNDSTATION_UPDATE_STATION_LIST,
  payload: { "data": { ...data } }
});

export const deleteGroundstationRow = (data, key) => ({

  type: GROUNDSTATION_DELETE_STATION_LIST_ROW,
  payload: { "data": { ...data }, "key": key }
});

export const clearGroundstationList = () => ({
  type: GROUNDSTATION_CLEAR_STATION_LIST
})

