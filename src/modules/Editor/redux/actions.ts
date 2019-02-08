import { ActionTypes, Action } from ".";
import { Color } from "../../../types";

export function setBackgroundPaletteCollection(id: string): Action {
  return {
    type: ActionTypes.SELECT_PALETTE_COLLECTION,
    payload: { type: "background", id }
  };
}

export function setSpritePaletteCollection(id: string): Action {
  return {
    type: ActionTypes.SELECT_PALETTE_COLLECTION,
    payload: { type: "sprite", id }
  };
}

export function addNewBackgroundPaletteCollection(): Action {
  return {
    type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
    payload: { type: "background", label: "New Collection" }
  };
}

export function addNewBackgroundPaletteCollection(): Action {
  return {
    type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
    payload: { type: "background", label: "New Collection" }
  };
}

export function copyBackgroundPaletteCollection(id: string): Action {
  return {
    type: ActionTypes.COPY_PALETTE_COLLECTION,
    payload: { type: "background", id }
  };
}

export function deleteBackgroundPaletteCollection(id: string): Action {
  return {
    type: ActionTypes.DELETE_PALETTE_COLLECTION,
    payload: { type: "background", id }
  };
}

export function renameBackgroundPaletteCollection(
  id: string,
  label: string
): Action {
  return {
    type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA,
    payload: { type: "background", id, label }
  };
}

export function changeBackgroundPaletteColor(
  paletteCollectionId: string,
  gamePaletteIndex: number,
  valueIndex: number,
  newColor: Color
) {
  return {
    type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
    payload: {
      type: "background",
      paletteCollectionId,
      gamePaletteIndex,
      valueIndex,
      newColor
    }
  };
}
