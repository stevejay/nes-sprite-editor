import { ActionTypes, Action } from "./types";
import { Color } from "../../../types";

export function setSystemPalette(id: string): Action {
  return {
    type: ActionTypes.SELECT_SYSTEM_PALETTE,
    payload: { id }
  };
}

export function setPaletteCollection(id: string): Action {
  return {
    type: ActionTypes.SELECT_PALETTE_COLLECTION,
    payload: { id }
  };
}

export function addNewBackgroundPaletteCollection(): Action {
  return {
    type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
    payload: { type: "background", label: "New Collection" }
  };
}

export function addNewSpritePaletteCollection(): Action {
  return {
    type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
    payload: { type: "sprite", label: "New Collection" }
  };
}

export function copyPaletteCollection(id: string): Action {
  return {
    type: ActionTypes.COPY_PALETTE_COLLECTION,
    payload: { id }
  };
}

export function deletePaletteCollection(id: string): Action {
  return {
    type: ActionTypes.DELETE_PALETTE_COLLECTION,
    payload: { id }
  };
}

export function renamePaletteCollection(id: string, label: string): Action {
  return {
    type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA,
    payload: { id, label }
  };
}

export function changePaletteColor(
  id: string,
  gamePaletteIndex: number,
  valueIndex: number,
  newColor: Color
): Action {
  return {
    type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
    payload: {
      id,
      gamePaletteIndex,
      valueIndex,
      newColor
    }
  };
}

export function setPatternTable(id: string): Action {
  return {
    type: ActionTypes.SELECT_PATTERN_TABLE,
    payload: { id }
  };
}

export function addNewBackgroundPatternTable(): Action {
  return {
    type: ActionTypes.ADD_NEW_PATTERN_TABLE,
    payload: { type: "background", label: "New Pattern Table" }
  };
}

export function copyPatternTable(id: string): Action {
  return {
    type: ActionTypes.COPY_PATTERN_TABLE,
    payload: { id }
  };
}

export function deletePatternTable(id: string): Action {
  return {
    type: ActionTypes.DELETE_PATTERN_TABLE,
    payload: { id }
  };
}

export function renamePatternTable(id: string, label: string): Action {
  return {
    type: ActionTypes.UPDATE_PATTERN_TABLE_METADATA,
    payload: { id, label }
  };
}

export function setNametable(id: string): Action {
  return {
    type: ActionTypes.SELECT_NAMETABLE,
    payload: { id }
  };
}

export function addNewNametable(): Action {
  return {
    type: ActionTypes.ADD_NEW_NAMETABLE,
    payload: { label: "New Nametable" }
  };
}

export function copyNametable(id: string): Action {
  return {
    type: ActionTypes.COPY_NAMETABLE,
    payload: { id }
  };
}

export function deleteNametable(id: string): Action {
  return {
    type: ActionTypes.DELETE_NAMETABLE,
    payload: { id }
  };
}

export function renameNametable(id: string, label: string): Action {
  return {
    type: ActionTypes.UPDATE_NAMETABLE_METADATA,
    payload: { id, label }
  };
}

export function changePatternTablePixels(
  id: string,
  tileIndex: number,
  startPixelIndex: number,
  newPixels: Array<number>
): Action {
  return {
    type: ActionTypes.CHANGE_PATTERN_TABLE_PIXELS,
    payload: {
      id,
      tileIndex,
      startPixelIndex,
      newPixels
    }
  };
}
