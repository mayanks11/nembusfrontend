import { MINIMAP_INITIALZE_MODEL, MINIMAP_DELETE_NODE, MINIMAP_ADD_NODE, MINIMAP_UPDATE_NODE, MINIMAP_ZOOMIN, MINIMAP_ZOOMOUT, MINIMAP_SETOFFSET, MINIMAP_CANVAS_WIDTH_HEIGHT, MINIMAP_MARK_WIDTH, MINIMAP_MARK_LEFT, MINIMAP_EXTRA_RIGHT_WIDTH, MINIMAP_EXTRA_LEFT_WIDTH, MINIMAP_EXTRA_TOP_HEIGHT, MINIMAP_EXTRA_BOTTOM_HEIGHT, MINIMAP_MARK_HEIGHT, MINIMAP_IS_OPEN_TAB, MINIMAP_DRAG_START, MINIMAP_DRAG_END } from './types';

/*
  Minimap Action of Minimap Component
  Nirmalya Saha
*/

export const initializeModel = (data) => ({
  type: MINIMAP_INITIALZE_MODEL,
  payload: data
});

export const deleteModel = (data) => ({
  type: MINIMAP_DELETE_NODE,
  payload: data
});

export const addModel = (data) => ({
  type: MINIMAP_ADD_NODE,
  payload: data
});

export const updateModel = (data) => ({
  type: MINIMAP_UPDATE_NODE,
  payload: data
});

export const zoomInModel = (data) => ({
  type: MINIMAP_ZOOMIN,
  payload: data
});

export const zoomOutModel = (data) => ({
  type: MINIMAP_ZOOMOUT,
  payload: data
});

export const setOffSet = (data) => ({
  type: MINIMAP_SETOFFSET,
  payload: data
});

export const canvasWidthHeight = (data) => ({
  type: MINIMAP_CANVAS_WIDTH_HEIGHT,
  payload: data
});

export const minimapMarkWidth = (data) => ({
  type: MINIMAP_MARK_WIDTH,
  payload: data
});

export const minimapMarkLeft = (data) => ({
  type: MINIMAP_MARK_LEFT,
  payload: data
});

export const minimapMarkHeight = (data) => ({
  type: MINIMAP_MARK_HEIGHT,
  payload: data
});

export const minimapIsOpenTab = (data) => ({
  type: MINIMAP_IS_OPEN_TAB,
  payload: data
});

export const extraPositiveWidth = (data) => ({
  type: MINIMAP_EXTRA_RIGHT_WIDTH,
  payload: data
});

export const extraNegitiveWidth = (data) => ({
  type: MINIMAP_EXTRA_LEFT_WIDTH,
  payload: data
});

export const extraPositiveHeight = (data) => ({
  type: MINIMAP_EXTRA_TOP_HEIGHT,
  payload: data
});

export const extraNegitiveHeight = (data) => ({
  type: MINIMAP_EXTRA_BOTTOM_HEIGHT,
  payload: data
});

export const onDragStart = (data) => ({
  type: MINIMAP_DRAG_START,
  payload: data
});

export const onDragEnd = (data) => ({
  type: MINIMAP_DRAG_END,
  payload: data
});