import { TilePosition } from "./experiment";
import React from "react";

export type Tool =
  | "palette"
  | "pattern"
  | "pencil"
  | "zoomIn"
  | "zoomOut"
  | "move";

export type State = {
  currentTool: Tool;
  selectedPaletteIndex: number;
  selectedColorIndex: number;
  currentTile: {
    tileIndex: number | null;
    metatileIndex: number | null;
  };
  selected: { row: number; column: number } | null; // nulled when tool changed
};

export enum ActionTypes {
  PENCIL_SELECTED = "PENCIL_SELECTED",
  TOOL_SELECTED = "TOOL_SELECTED",
  PALETTE_SELECTED = "PALETTE_SELECTED",
  COLOR_SELECTED = "COLOR_SELECTED",
  CURRENT_TILE_UPDATED = "CURRENT_TILE_UPDATED"
}

export type Action =
  | {
      type: ActionTypes.PENCIL_SELECTED;
      payload: { colorIndex: State["selectedColorIndex"] };
    }
  | {
      type: ActionTypes.TOOL_SELECTED;
      payload: Tool;
    }
  | {
      type: ActionTypes.PALETTE_SELECTED;
      payload: { paletteIndex: State["selectedPaletteIndex"] };
    }
  | {
      type: ActionTypes.COLOR_SELECTED;
      payload: State["selectedColorIndex"];
    }
  | {
      type: ActionTypes.CURRENT_TILE_UPDATED;
      payload: TilePosition;
    };

const INITIAL_TOOL_STATE: State = {
  currentTool: "zoomIn",
  selectedPaletteIndex: 0,
  selectedColorIndex: 0,
  currentTile: {
    tileIndex: null,
    metatileIndex: null
  },
  selected: null
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.PENCIL_SELECTED:
      return {
        ...state,
        currentTool: "pencil",
        selectedColorIndex: action.payload.colorIndex,
        currentTile: {
          tileIndex: null,
          metatileIndex: null
        }
      };
    case ActionTypes.TOOL_SELECTED:
      const currentTool = action.payload;
      if (currentTool === state.currentTool) {
        return state;
      }
      return { ...state, currentTool };
    case ActionTypes.COLOR_SELECTED:
      return {
        ...state,
        selectedColorIndex: action.payload
      };
    case ActionTypes.PALETTE_SELECTED:
      return {
        ...state,
        currentTool: "palette",
        selectedPaletteIndex: action.payload.paletteIndex,
        currentTile: {
          tileIndex: null,
          metatileIndex: null
        }
      };
    case ActionTypes.CURRENT_TILE_UPDATED:
      return {
        ...state,
        currentTile: action.payload
      };
    default:
      return state;
  }
}

export function useToolReducer() {
  return React.useReducer(reducer, INITIAL_TOOL_STATE);
}
