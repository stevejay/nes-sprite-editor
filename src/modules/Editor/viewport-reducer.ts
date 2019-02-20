import {
  RenderCanvasPositioning,
  ViewportCoord,
  createInitialRenderCanvasPositioning,
  adjustZoomOfRenderCanvas,
  zoomIntoRenderCanvas,
  zoomOutOfRenderCanvas,
  moveRenderCanvas,
  ViewportSize
} from "./experiment";
import React from "react";

export const VIEWPORT_SIZE: ViewportSize = { width: 512, height: 512 };

export type State = RenderCanvasPositioning;

export enum ActionTypes {
  INITIALIZE = "INITIALIZE",
  CHANGE_SCALE = "CHANGE_SCALE",
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  MOVE = "MOVE"
}

export type Action =
  | {
      type: ActionTypes.CHANGE_SCALE;
      payload: RenderCanvasPositioning["scale"];
    }
  | { type: ActionTypes.INITIALIZE }
  | { type: ActionTypes.ZOOM_IN; payload: ViewportCoord }
  | { type: ActionTypes.ZOOM_OUT; payload: ViewportCoord }
  | { type: ActionTypes.MOVE; payload: ViewportCoord };

function initializeReducer(): State {
  return createInitialRenderCanvasPositioning(VIEWPORT_SIZE);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.INITIALIZE:
      return initializeReducer();
    case ActionTypes.CHANGE_SCALE:
      return adjustZoomOfRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case ActionTypes.ZOOM_IN:
      return zoomIntoRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case ActionTypes.ZOOM_OUT:
      return zoomOutOfRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    case ActionTypes.MOVE:
      return moveRenderCanvas(state, VIEWPORT_SIZE, action.payload);
    default:
      return state;
  }
}

export function useViewportReducer() {
  return React.useReducer(reducer, initializeReducer());
}
