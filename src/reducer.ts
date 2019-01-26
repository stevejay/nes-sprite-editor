import { createSelector } from "reselect";
import { find } from "lodash";
import {
  GamePalette,
  SystemPalette,
  Color,
  GamePaletteTypes,
  TileGrid
} from "./types";
import {
  SYSTEM_PALETTE_OPTIONS,
  BACKGROUND_TILE_GRID_OPTIONS
} from "./constants";

export enum ActionTypes {
  CHANGE_SYSTEM_PALETTE = "CHANGE_SYSTEM_PALETTE",
  CHANGE_BACKGROUND_COLOR = "CHANGE_BACKGROUND_COLOR",
  CHANGE_GAME_PALETTE_COLOR = "CHANGE_GAME_PALETTE_COLOR",
  CHANGE_SELECTED_BACKGROUND_TILE = "CHANGE_SELECTED_BACKGROUND_TILE"
}

export type Position = {
  row: number;
  column: number;
};

export type State = {
  systemPalettes: Array<SystemPalette>;
  systemPaletteId: SystemPalette["id"];
  backgroundColorId: Color["id"];
  gamePalettes: Array<GamePalette>;
  backgroundTileGrids: Array<TileGrid>;
  backgroundTileGridId: TileGrid["id"];
  backgroundTileGridScaling: number;
  selectedBackgroundTile: Position;
};

export type GamePaletteChange = {
  gamePalette: GamePalette;
  valueIndex: number;
  newColor: Color;
};

export type GamePaletteWithColors = GamePalette & {
  colors: Array<Color>;
};

export type Action =
  | { type: ActionTypes.CHANGE_SYSTEM_PALETTE; payload: SystemPalette["id"] }
  | { type: ActionTypes.CHANGE_BACKGROUND_COLOR; payload: number }
  | { type: ActionTypes.CHANGE_GAME_PALETTE_COLOR; payload: GamePaletteChange }
  | {
      type: ActionTypes.CHANGE_SELECTED_BACKGROUND_TILE;
      payload: Position;
    };

export const initialState: State = {
  // palettes
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  systemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  backgroundColorId: 0x0f,
  gamePalettes: [
    { type: GamePaletteTypes.BACKGROUND, id: 0, values: [19, 20, 21] },
    { type: GamePaletteTypes.BACKGROUND, id: 1, values: [23, 24, 25] },
    { type: GamePaletteTypes.BACKGROUND, id: 2, values: [0x30, 0x23, 0x16] },
    { type: GamePaletteTypes.BACKGROUND, id: 3, values: [38, 39, 40] },
    { type: GamePaletteTypes.SPRITE, id: 0, values: [1, 20, 5] },
    { type: GamePaletteTypes.SPRITE, id: 1, values: [2, 24, 6] },
    { type: GamePaletteTypes.SPRITE, id: 2, values: [3, 35, 7] },
    { type: GamePaletteTypes.SPRITE, id: 3, values: [4, 39, 8] }
  ],
  // background
  backgroundTileGrids: BACKGROUND_TILE_GRID_OPTIONS,
  backgroundTileGridId: BACKGROUND_TILE_GRID_OPTIONS[0].id,
  backgroundTileGridScaling: 3,
  selectedBackgroundTile: { row: 0, column: 0 }
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.CHANGE_SYSTEM_PALETTE:
      return { ...state, systemPaletteId: action.payload };
    case ActionTypes.CHANGE_BACKGROUND_COLOR:
      return { ...state, backgroundColorId: action.payload };
    case ActionTypes.CHANGE_GAME_PALETTE_COLOR:
      const { gamePalette, valueIndex, newColor } = action.payload;
      return {
        ...state,
        gamePalettes: state.gamePalettes.map(element => {
          if (
            element.type === gamePalette.type &&
            element.id === gamePalette.id
          ) {
            const newValues = element.values.slice();
            newValues[valueIndex] = newColor.id;
            return {
              type: element.type,
              id: element.id,
              values: newValues
            } as GamePalette;
          }
          return element;
        })
      };
    case ActionTypes.CHANGE_SELECTED_BACKGROUND_TILE:
      return {
        ...state,
        selectedBackgroundTile: action.payload
      };
    default:
      return state;
  }
}

export function selectSystemPalettes(state: State) {
  return state.systemPalettes;
}

export function selectSystemPaletteId(state: State) {
  return state.systemPaletteId;
}

export function selectBackgroundColorId(state: State) {
  return state.backgroundColorId;
}

export function selectGamePalettes(state: State) {
  return state.gamePalettes;
}

export function selectSystemPalette(state: State) {
  const systemPalettes = selectSystemPalettes(state);
  const systemPaletteId = selectSystemPaletteId(state);
  return find(systemPalettes, x => x.id === systemPaletteId) as SystemPalette;
}

export const selectBackgroundColor = createSelector(
  selectSystemPalette,
  selectBackgroundColorId,
  (systemPalette, backgroundColorId) =>
    find(
      systemPalette.values,
      element => element.id === backgroundColorId
    ) as Color
);

export const selectBackgroundPalettes = createSelector(
  selectSystemPalette,
  selectGamePalettes,
  (systemPalette, gamePalettes) =>
    gamePalettes
      .filter(x => x.type === GamePaletteTypes.BACKGROUND)
      .sort(x => x.id)
      .map(gamePalette => mapToGamePaletteColors(gamePalette, systemPalette))
);

export const selectSpritePalettes = createSelector(
  selectSystemPalette,
  selectGamePalettes,
  (systemPalette, gamePalettes) =>
    gamePalettes
      .filter(x => x.type === GamePaletteTypes.SPRITE)
      .sort(x => x.id)
      .map(gamePalette => mapToGamePaletteColors(gamePalette, systemPalette))
);

function mapToGamePaletteColors(
  gamePalette: GamePalette,
  systemPalette: SystemPalette
): GamePaletteWithColors {
  return {
    ...gamePalette,
    colors: gamePalette.values.map(colorId => systemPalette.values[colorId])
  };
}

export function selectBackgroundTileGrids(state: State) {
  return state.backgroundTileGrids;
}

export function selectCurrentBackgroundTileGridId(state: State) {
  return state.backgroundTileGridId;
}

export function selectCurrentBackgroundTileGrid(state: State) {
  const backgroundTileGrids = selectBackgroundTileGrids(state);
  const currentBackgroundTileGridId = selectCurrentBackgroundTileGridId(state);
  return find(
    backgroundTileGrids,
    x => x.id === currentBackgroundTileGridId
  ) as TileGrid;
}

export function selectBackgroundTileGridScaling(state: State) {
  return state.backgroundTileGridScaling;
}

export function selectSelectedBackgroundTile(state: State) {
  return state.selectedBackgroundTile;
}

export const selectSelectedBackgroundTiles = createSelector(
  selectCurrentBackgroundTileGrid,
  selectSelectedBackgroundTile,
  (tileGrid, selected) => {
    const row0Index = selected.row * 2 * 16 + selected.column * 2;
    return [
      tileGrid.tiles[row0Index],
      tileGrid.tiles[row0Index + 1],
      tileGrid.tiles[row0Index + 16],
      tileGrid.tiles[row0Index + 16 + 1]
    ];
  }
);
