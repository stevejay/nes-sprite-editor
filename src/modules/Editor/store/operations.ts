import { ThunkAction } from "redux-thunk";
import { default as exportCurrentStateImpl } from "./export-current-state";
import {
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable,
  selectCurrentSpritePaletteCollection
} from "./selectors";
import { Action, EditorStateSlice } from "./types";

export function exportCurrentState(): ThunkAction<
  void,
  EditorStateSlice,
  null,
  Action
> {
  return async (_dispatch, getState) => {
    const state = getState();
    const backgroundPaletteCollection = selectCurrentBackgroundPaletteCollection(
      state
    );
    const spritePaletteCollection = selectCurrentSpritePaletteCollection(state);
    const backgroundPatternTable = selectCurrentBackgroundPatternTable(state);
    const nametable = selectCurrentNametable(state);
    await exportCurrentStateImpl(
      backgroundPaletteCollection,
      spritePaletteCollection,
      backgroundPatternTable,
      nametable
    );
  };
}
