import { find } from "lodash";
import { createSelector } from "reselect";
import {
  GamePalette,
  GamePaletteCollection,
  SystemPalette,
  GamePaletteWithColors,
  GamePaletteCollectionWithColors
} from "../../types";
import { PaletteCollectionState, State } from "./types";

export function selectNametables(state: State) {
  return state.nametables;
}

export function selectCurrentNametableId(state: State) {
  return state.currentNametableId;
}

export const selectCurrentNametable = createSelector(
  selectNametables,
  selectCurrentNametableId,
  (nametables, currentId) => find(nametables, x => x.id === currentId) || null
);

export function selectSystemPalettes(state: State) {
  return state.systemPalettes;
}

export function selectCurrentSystemPaletteId(state: State) {
  return state.currentSystemPaletteId;
}

export const selectCurrentSystemPalette = createSelector(
  selectSystemPalettes,
  selectCurrentSystemPaletteId,
  (systemPalettes, currentSystemPaletteId) =>
    find(systemPalettes, x => x.id === currentSystemPaletteId)!
);

export function selectBackgroundPaletteCollections(state: State) {
  return state.paletteCollections.background.collections;
}

export function selectCurrentBackgroundPaletteCollectionId(state: State) {
  return state.paletteCollections.background.currentCollectionId;
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

export function selectSpritePaletteCollections(state: State) {
  return state.paletteCollections.sprite.collections;
}

export function selectCurrentSpritePaletteCollectionId(state: State) {
  return state.paletteCollections.sprite.currentCollectionId;
}

export const selectCurrentSpritePalettes = createSelector(
  selectCurrentSystemPalette,
  selectSpritePaletteCollections,
  selectCurrentSpritePaletteCollectionId,
  createGamePaletteCollectionWithColors
);

export function selectBackgroundPatternTables(state: State) {
  return state.patternTables.background.tables;
}

export function selectCurrentBackgroundPatternTableId(state: State) {
  return state.patternTables.background.currentTableId;
}

export const selectCurrentBackgroundPatternTable = createSelector(
  selectBackgroundPatternTables,
  selectCurrentBackgroundPatternTableId,
  (patternTables, currentId) =>
    find(patternTables, x => x.id === currentId) || null
);

export function selectSpritePatternTables(state: State) {
  return state.patternTables.sprite.tables;
}

export function selectCurrentSpritePatternTableId(state: State) {
  return state.patternTables.sprite.currentTableId;
}

export const selectCurrentSpritePatternTable = createSelector(
  selectSpritePatternTables,
  selectCurrentSpritePatternTableId,
  (patternTables, currentId) =>
    find(patternTables, x => x.id === currentId) || null
);