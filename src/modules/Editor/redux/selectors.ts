import { find } from "lodash";
import { createSelector } from "reselect";
import {
  GamePaletteCollection,
  GamePaletteCollectionWithColors,
  SystemPalette
} from "../../../types";
import { EditorStateSlice } from "./types";

export function selectNametables(state: EditorStateSlice) {
  return state.editor.nametables;
}

export function selectCurrentNametableId(state: EditorStateSlice) {
  return state.editor.selectedNametableId;
}

export const selectCurrentNametable = createSelector(
  selectNametables,
  selectCurrentNametableId,
  (nametables, currentId) => find(nametables, x => x.id === currentId) || null
);

export function selectSystemPalettes(state: EditorStateSlice) {
  return state.editor.systemPalettes;
}

export function selectCurrentSystemPaletteId(state: EditorStateSlice) {
  return state.editor.selectedSystemPaletteId;
}

export const selectCurrentSystemPalette = createSelector(
  selectSystemPalettes,
  selectCurrentSystemPaletteId,
  (systemPalettes, selectedSystemPaletteId) =>
    find(systemPalettes, x => x.id === selectedSystemPaletteId)!
);

export function selectAllPaletteCollections(state: EditorStateSlice) {
  return state.editor.paletteCollections;
}

export const selectBackgroundPaletteCollections = createSelector(
  selectAllPaletteCollections,
  paletteCollections => paletteCollections.filter(x => x.type === "background")
);

export function selectCurrentBackgroundPaletteCollectionId(
  state: EditorStateSlice
) {
  return state.editor.selectedPaletteCollectionIds["background"];
}

export const selectCurrentBackgroundPalettes = createSelector(
  selectCurrentSystemPalette,
  selectBackgroundPaletteCollections,
  selectCurrentBackgroundPaletteCollectionId,
  createGamePaletteCollectionWithColors
);

function createGamePaletteCollectionWithColors(
  systemPalette: SystemPalette,
  paletteCollections: Array<GamePaletteCollection>,
  currentId: GamePaletteCollection["id"] | null
): GamePaletteCollectionWithColors | null {
  const paletteCollection =
    find(paletteCollections, collection => collection.id === currentId) || null;
  if (!paletteCollection) {
    return null;
  }
  return {
    ...paletteCollection,
    gamePalettes: paletteCollection.gamePalettes.map(gamePalette => ({
      ...gamePalette,
      colors: gamePalette.colorIndexes.map(
        colorId => systemPalette.values[colorId]
      )
    }))
  };
}

export const selectSpritePaletteCollections = createSelector(
  selectAllPaletteCollections,
  paletteCollections => paletteCollections.filter(x => x.type === "sprite")
);

export function selectCurrentSpritePaletteCollectionId(
  state: EditorStateSlice
) {
  return state.editor.selectedPaletteCollectionIds["sprite"];
}

export const selectCurrentSpritePalettes = createSelector(
  selectCurrentSystemPalette,
  selectSpritePaletteCollections,
  selectCurrentSpritePaletteCollectionId,
  createGamePaletteCollectionWithColors
);

export function selectAllPatternTables(state: EditorStateSlice) {
  return state.editor.patternTables;
}

export const selectBackgroundPatternTables = createSelector(
  selectAllPatternTables,
  patternTables => patternTables.filter(x => x.type === "background")
);

export function selectCurrentBackgroundPatternTableId(state: EditorStateSlice) {
  return state.editor.selectedPatternTableIds["background"];
}

export const selectCurrentBackgroundPatternTable = createSelector(
  selectBackgroundPatternTables,
  selectCurrentBackgroundPatternTableId,
  (patternTables, currentId) =>
    find(patternTables, x => x.id === currentId) || null
);

export const selectSpritePatternTables = createSelector(
  selectAllPatternTables,
  patternTables => patternTables.filter(x => x.type === "sprite")
);

export function selectCurrentSpritePatternTableId(state: EditorStateSlice) {
  return state.editor.selectedPatternTableIds["sprite"];
}

export const selectCurrentSpritePatternTable = createSelector(
  selectSpritePatternTables,
  selectCurrentSpritePatternTableId,
  (patternTables, currentId) =>
    find(patternTables, x => x.id === currentId) || null
);
