import { createSelector } from "reselect";
import { find, includes } from "lodash";
import {
  GamePalette,
  SystemPalette,
  Color,
  GamePaletteTypes,
  TileGrid
} from "./types";
import {
  SYSTEM_PALETTE_OPTIONS,
  BACKGROUND_PATTERN_TABLE_OPTIONS
} from "./constants";

export enum ActionTypes {
  CHANGE_SYSTEM_PALETTE = "CHANGE_SYSTEM_PALETTE",
  CHANGE_BACKGROUND_COLOR = "CHANGE_BACKGROUND_COLOR",
  CHANGE_GAME_PALETTE_COLOR = "CHANGE_GAME_PALETTE_COLOR",
  CHANGE_CURRENT_BACKGROUND_METATILE = "CHANGE_CURRENT_BACKGROUND_METATILE",
  CHANGE_CURRENT_BACKGROUND_METATILE_PALETTE = "CHANGE_CURRENT_BACKGROUND_METATILE_PALETTE",
  CHANGE_BACKGROUND_METATILE_SIZE = "CHANGE_BACKGROUND_METATILE_SIZE"
}

export type MetatileSelection = {
  metatileSize: 1 | 2;
  row: number;
  column: number;
};

export type State = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPaletteId: SystemPalette["id"];
  backgroundColorId: Color["id"];
  gamePalettes: Array<GamePalette>;
  backgroundPatternTables: Array<TileGrid>;
  currentBackgroundPatternTableId: TileGrid["id"];
  backgroundPatternTableScaling: number;
  currentBackgroundMetatile: MetatileSelection;
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
      type: ActionTypes.CHANGE_BACKGROUND_METATILE_SIZE;
      payload: MetatileSelection["metatileSize"];
    }
  | {
      type: ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE;
      payload: Partial<MetatileSelection>;
    }
  | {
      type: ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE_PALETTE;
      payload: GamePalette["id"];
    };

export const initialState: State = {
  // system palette
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  currentSystemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  // game palettes
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
  // backgrounds
  backgroundPatternTables: BACKGROUND_PATTERN_TABLE_OPTIONS,
  currentBackgroundPatternTableId: BACKGROUND_PATTERN_TABLE_OPTIONS[0].id,
  backgroundPatternTableScaling: 3,
  currentBackgroundMetatile: { metatileSize: 2, row: 0, column: 0 }
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.CHANGE_SYSTEM_PALETTE:
      return { ...state, currentSystemPaletteId: action.payload };
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
    case ActionTypes.CHANGE_BACKGROUND_METATILE_SIZE:
      const newMetatileSize = action.payload;
      const { metatileSize, row, column } = state.currentBackgroundMetatile;
      if (newMetatileSize === metatileSize) {
        return state;
      }
      if (newMetatileSize < metatileSize) {
        return {
          ...state,
          currentBackgroundMetatile: {
            metatileSize: newMetatileSize,
            row: row * (metatileSize / newMetatileSize),
            column: column * (metatileSize / newMetatileSize)
          }
        };
      }
      return {
        ...state,
        currentBackgroundMetatile: {
          metatileSize: newMetatileSize,
          row: Math.floor(row / newMetatileSize),
          column: Math.floor(column / newMetatileSize)
        }
      };
    case ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE:
      return {
        ...state,
        currentBackgroundMetatile: {
          ...state.currentBackgroundMetatile,
          ...action.payload
        }
      };
    case ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE_PALETTE:
      return {
        ...state,
        backgroundPatternTables: state.backgroundPatternTables.map(table => {
          if (table.id !== state.currentBackgroundPatternTableId) {
            return table;
          }
          const indexes = getTileIndexesForMetatile(
            state.currentBackgroundMetatile
          );
          return {
            ...table,
            tiles: table.tiles.map((tile, index) => {
              if (includes(indexes, index)) {
                return {
                  ...tile,
                  gamePaletteId: action.payload
                };
              }
              return tile;
            }) as TileGrid["tiles"]
          };
        })
      };
    default:
      return state;
  }
}

export function selectSystemPalettes(state: State) {
  return state.systemPalettes;
}

export function selectCurrentSystemPaletteId(state: State) {
  return state.currentSystemPaletteId;
}

export function selectCurrentSystemPalette(state: State) {
  const systemPalettes = selectSystemPalettes(state);
  const currentSystemPaletteId = selectCurrentSystemPaletteId(state);
  return find(
    systemPalettes,
    x => x.id === currentSystemPaletteId
  ) as SystemPalette;
}

export function selectBackgroundColorId(state: State) {
  return state.backgroundColorId;
}

export function selectGamePalettes(state: State) {
  return state.gamePalettes;
}

export const selectBackgroundColor = createSelector(
  selectCurrentSystemPalette,
  selectBackgroundColorId,
  (systemPalette, backgroundColorId) =>
    find(
      systemPalette.values,
      element => element.id === backgroundColorId
    ) as Color
);

export const selectBackgroundPalettes = createSelector(
  selectCurrentSystemPalette,
  selectGamePalettes,
  (systemPalette, gamePalettes) =>
    gamePalettes
      .filter(x => x.type === GamePaletteTypes.BACKGROUND)
      .sort(x => x.id)
      .map(gamePalette => mapToGamePaletteColors(gamePalette, systemPalette))
);

export const selectSpritePalettes = createSelector(
  selectCurrentSystemPalette,
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

export function selectBackgroundPatternTables(state: State) {
  return state.backgroundPatternTables;
}

export function selectCurrentBackgroundPatternTableId(state: State) {
  return state.currentBackgroundPatternTableId;
}

export function selectCurrentBackgroundPatternTable(state: State) {
  const backgroundPatternTables = selectBackgroundPatternTables(state);
  const currentBackgroundTileGridId = selectCurrentBackgroundPatternTableId(
    state
  );
  return find(
    backgroundPatternTables,
    x => x.id === currentBackgroundTileGridId
  ) as TileGrid;
}

export function selectBackgroundPatternTableScaling(state: State) {
  return state.backgroundPatternTableScaling;
}

export function selectCurrentBackgroundMetatile(state: State) {
  return state.currentBackgroundMetatile;
}

export const selectCurrentBackgroundMetatileTiles = createSelector(
  selectCurrentBackgroundPatternTable,
  selectCurrentBackgroundMetatile,
  (patternTable, metatile) => {
    const indexes = getTileIndexesForMetatile(metatile);
    return indexes.map(index => patternTable.tiles[index]);
  }
);

function getTileIndexesForMetatile(metatile: MetatileSelection) {
  const result = [];

  const startIndex =
    metatile.row * metatile.metatileSize * 16 +
    metatile.column * metatile.metatileSize;

  for (let row = 0; row < metatile.metatileSize; ++row) {
    for (let column = 0; column < metatile.metatileSize; ++column) {
      result.push(startIndex + row * 16 + column);
    }
  }

  return result;
}
