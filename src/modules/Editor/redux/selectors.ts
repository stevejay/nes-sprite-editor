import { find } from "lodash";
import { createSelector } from "reselect";
import {
  GamePalette,
  GamePaletteCollection,
  SystemPalette,
  GamePaletteWithColors,
  GamePaletteCollectionWithColors
} from "../../../types";
import { PaletteCollectionState, ReduxStateSlice } from "./types";

export function selectNametables(state: ReduxStateSlice) {
  return state.editor.nametables;
}

export function selectCurrentNametableId(state: ReduxStateSlice) {
  return state.editor.currentNametableId;
}

export const selectCurrentNametable = createSelector(
  selectNametables,
  selectCurrentNametableId,
  (nametables, currentId) => find(nametables, x => x.id === currentId) || null
);

export function selectSystemPalettes(state: ReduxStateSlice) {
  return state.editor.systemPalettes;
}

export function selectCurrentSystemPaletteId(state: ReduxStateSlice) {
  return state.editor.currentSystemPaletteId;
}

export const selectCurrentSystemPalette = createSelector(
  selectSystemPalettes,
  selectCurrentSystemPaletteId,
  (systemPalettes, currentSystemPaletteId) =>
    find(systemPalettes, x => x.id === currentSystemPaletteId)!
);

export function selectBackgroundPaletteCollections(state: ReduxStateSlice) {
  return state.editor.paletteCollections.background.collections;
}

export function selectCurrentBackgroundPaletteCollectionId(
  state: ReduxStateSlice
) {
  return state.editor.paletteCollections.background.currentCollectionId;
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
  currentId: PaletteCollectionState["currentCollectionId"]
): GamePaletteCollectionWithColors | null {
  const paletteCollection =
    find(paletteCollections, collection => collection.id === currentId) || null;
  if (!paletteCollection) {
    return null;
  }
  return {
    id: paletteCollection.id,
    label: paletteCollection.label,
    gamePalettes: paletteCollection.gamePalettes.map(gamePalette =>
      mapToGamePaletteColors(gamePalette, systemPalette)
    )
  };
}

function mapToGamePaletteColors(
  gamePalette: GamePalette,
  systemPalette: SystemPalette
): GamePaletteWithColors {
  return {
    ...gamePalette,
    colors: gamePalette.colorIndexes.map(
      colorId => systemPalette.values[colorId]
    )
  };
}

export function selectSpritePaletteCollections(state: ReduxStateSlice) {
  return state.editor.paletteCollections.sprite.collections;
}

export function selectCurrentSpritePaletteCollectionId(state: ReduxStateSlice) {
  return state.editor.paletteCollections.sprite.currentCollectionId;
}

export const selectCurrentSpritePalettes = createSelector(
  selectCurrentSystemPalette,
  selectSpritePaletteCollections,
  selectCurrentSpritePaletteCollectionId,
  createGamePaletteCollectionWithColors
);

export function selectBackgroundPatternTables(state: ReduxStateSlice) {
  return state.editor.patternTables.background.tables;
}

export function selectCurrentBackgroundPatternTableId(state: ReduxStateSlice) {
  return state.editor.patternTables.background.currentTableId;
}

export const selectCurrentBackgroundPatternTable = createSelector(
  selectBackgroundPatternTables,
  selectCurrentBackgroundPatternTableId,
  (patternTables, currentId) =>
    find(patternTables, x => x.id === currentId) || null
);

export function selectSpritePatternTables(state: ReduxStateSlice) {
  return state.editor.patternTables.sprite.tables;
}

export function selectCurrentSpritePatternTableId(state: ReduxStateSlice) {
  return state.editor.patternTables.sprite.currentTableId;
}

export const selectCurrentSpritePatternTable = createSelector(
  selectSpritePatternTables,
  selectCurrentSpritePatternTableId,
  (patternTables, currentId) =>
    find(patternTables, x => x.id === currentId) || null
);
