import * as nametable from "./nametable";
import * as paletteCollection from "./palette-collection";
import * as patternTable from "./pattern-table";
import * as systemPalette from "./system-palette";
import { State, Action } from "../types";

export const SLICE_NAME = "editor";

const initialState = {
  ...nametable.initialState,
  ...paletteCollection.initialState,
  ...patternTable.initialState,
  ...systemPalette.initialState
} as State;

const reducers = [
  nametable.reducer,
  paletteCollection.reducer,
  patternTable.reducer,
  systemPalette.reducer
];

export function reducer(state: State = initialState, action: Action): State {
  return reducers.reduce(
    (newState, reducer) => reducer(newState, action),
    state
  );
}
