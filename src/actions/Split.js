import { SET_MAX, SET_MIN, SET_LOCK, SET_EXPAND, SET_WINDOW_COLLAPSE, SET_NEMBUS_PROJECT_WIDTHCHANGED } from './types';

/**
 * Split Simulation
 * Action
 * Nirmalya Saha
 */

export const setMax = (data) => ({
  type: SET_MAX,
  payload: data
});

export const setMin = (data) => ({
  type: SET_MIN,
  payload: data
});

export const setLock = (data) => ({
    type: SET_LOCK,
    payload: data
});

export const setExpand = (data) => ({
  type: SET_EXPAND,
  payload: data
});

export const setWindowCollapse = (data) => ({
  type: SET_WINDOW_COLLAPSE,
  payload: data
});

export const setNembusProjectWidthChanged = (data) => ({
  type: SET_NEMBUS_PROJECT_WIDTHCHANGED,
  payload: data
})