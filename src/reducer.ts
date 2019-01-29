import { createSelector } from "reselect";
import { cloneDeep, find, isEmpty, range } from "lodash";
import uuidv4 from "uuid/v4";
import {
  GamePalette,
  SystemPalette,
  Color,
  PatternTable,
  GamePaletteCollection,
  GamePaletteType,
  PatternTableType,
  Nametable
} from "./types";
import {
  SYSTEM_PALETTE_OPTIONS,
  BACKGROUND_PATTERN_TABLE_OPTIONS
} from "./constants";

export enum ActionTypes {
  // System palettes:
  SELECT_SYSTEM_PALETTE = "SELECT_SYSTEM_PALETTE",
  // Game palettes:
  SELECT_PALETTE_COLLECTION = "SELECT_PALETTE_COLLECTION",
  ADD_NEW_PALETTE_COLLECTION = "ADD_NEW_PALETTE_COLLECTION",
  UPDATE_PALETTE_COLLECTION_METADATA = "UPDATE_PALETTE_COLLECTION_METADATA",
  COPY_PALETTE_COLLECTION = "COPY_PALETTE_COLLECTION",
  DELETE_PALETTE_COLLECTION = "DELETE_PALETTE_COLLECTION",
  CHANGE_GAME_PALETTE_COLOR = "CHANGE_GAME_PALETTE_COLOR",
  // Pattern tables:
  SELECT_PATTERN_TABLE = "SELECT_PATTERN_TABLE",
  ADD_NEW_PATTERN_TABLE = "ADD_NEW_PATTERN_TABLE",
  UPDATE_PATTERN_TABLE_METADATA = "UPDATE_PATTERN_TABLE_METADATA",
  COPY_PATTERN_TABLE = "COPY_PATTERN_TABLE",
  DELETE_PATTERN_TABLE = "DELETE_PATTERN_TABLE",
  CHANGE_PATTERN_TABLE_PIXELS = "CHANGE_PATTERN_TABLE_PIXELS",
  // Nametables:
  SELECT_NAMETABLE = "SELECT_NAMETABLE",
  ADD_NEW_NAMETABLE = "ADD_NEW_NAMETABLE",
  UPDATE_NAMETABLE_METADATA = "UPDATE_NAMETABLE_METADATA",
  COPY_NAMETABLE = "COPY_NAMETABLE",
  DELETE_NAMETABLE = "DELETE_NAMETABLE",
  CHANGE_NAMETABLE_TILE_INDEX = "CHANGE_NAMETABLE_TILE_INDEX",
  CHANGE_NAMETABLE_PALETTE_INDEX = "CHANGE_NAMETABLE_PALETTE_INDEX"

  // CHANGE_CURRENT_BACKGROUND_METATILE = "CHANGE_CURRENT_BACKGROUND_METATILE",
  // CHANGE_BACKGROUND_METATILE_SIZE = "CHANGE_BACKGROUND_METATILE_SIZE"
}

type PaletteCollectionState = {
  collections: Array<GamePaletteCollection>;
  currentCollectionId: GamePaletteCollection["id"] | null;
};

type PatternTableState = {
  tables: Array<PatternTable>;
  currentTableId: PatternTable["id"] | null;
};

export type State = {
  systemPalettes: Array<SystemPalette>;
  currentSystemPaletteId: SystemPalette["id"];
  paletteCollections: { [key in GamePaletteType]: PaletteCollectionState };
  patternTables: { [key in PatternTableType]: PatternTableState };
  nametables: Array<Nametable>;
  currentNametableId: Nametable["id"] | null;
};

export type GamePaletteWithColors = GamePalette & {
  colors: Array<Color>;
};

export type GamePaletteCollectionWithColors = {
  id: GamePaletteCollection["id"];
  label: GamePaletteCollection["label"];
  gamePalettes: Array<GamePaletteWithColors>;
};

export type Action =
  | {
      type: ActionTypes.SELECT_SYSTEM_PALETTE;
      payload: {
        id: SystemPalette["id"];
      };
    }
  | {
      type: ActionTypes.SELECT_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.ADD_NEW_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        label: GamePaletteCollection["label"];
      };
    }
  | {
      type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
        label: GamePaletteCollection["label"];
      };
    }
  | {
      type: ActionTypes.COPY_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_PALETTE_COLLECTION;
      payload: {
        type: GamePaletteType;
        id: GamePaletteCollection["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_GAME_PALETTE_COLOR;
      payload: {
        type: GamePaletteType;
        paletteCollectionId: GamePaletteCollection["id"];
        gamePaletteIndex: number;
        valueIndex: number;
        newColor: Color;
      };
    }
  | {
      type: ActionTypes.SELECT_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.ADD_NEW_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        label: PatternTable["label"];
      };
    }
  | {
      type: ActionTypes.UPDATE_PATTERN_TABLE_METADATA;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
        label: PatternTable["label"];
      };
    }
  | {
      type: ActionTypes.COPY_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_PATTERN_TABLE;
      payload: {
        type: PatternTableType;
        id: PatternTable["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_PATTERN_TABLE_PIXELS;
      payload: {
        type: PatternTableType;
        tableId: PatternTable["id"];
        tileIndex: number;
        startPixelIndex: number;
        newPixels: Array<number>;
      };
    }
  | {
      type: ActionTypes.SELECT_NAMETABLE;
      payload: {
        id: Nametable["id"];
      };
    }
  | {
      type: ActionTypes.ADD_NEW_NAMETABLE;
      payload: {
        label: Nametable["label"];
      };
    }
  | {
      type: ActionTypes.UPDATE_NAMETABLE_METADATA;
      payload: {
        id: Nametable["id"];
        label: Nametable["label"];
      };
    }
  | {
      type: ActionTypes.COPY_NAMETABLE;
      payload: {
        id: Nametable["id"];
      };
    }
  | {
      type: ActionTypes.DELETE_NAMETABLE;
      payload: {
        id: Nametable["id"];
      };
    }
  | {
      type: ActionTypes.CHANGE_NAMETABLE_TILE_INDEX;
      payload: {
        nametableId: Nametable["id"];
        tileIndex: number;
        newValue: number;
      };
    }
  | {
      type: ActionTypes.CHANGE_NAMETABLE_PALETTE_INDEX;
      payload: {
        nametableId: Nametable["id"];
        paletteIndex: number;
        newValue: number;
      };
    };

export const initialState: State = {
  // There will always be at least one system palette,
  // and so always a current system palette.
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  currentSystemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  paletteCollections: {
    background: {
      collections: [
        {
          id: "0",
          label: "Backgrounds #0",
          gamePalettes: [
            { colorIndexes: [0x0f, 19, 20, 21] },
            { colorIndexes: [0x0f, 23, 24, 25] },
            { colorIndexes: [0x0f, 0x30, 0x23, 0x16] },
            { colorIndexes: [0x0f, 38, 39, 40] }
          ]
        }
      ],
      currentCollectionId: "0"
    },
    sprite: {
      collections: [
        {
          id: "0",
          label: "Sprites #0",
          gamePalettes: [
            { colorIndexes: [0x0f, 1, 20, 5] },
            { colorIndexes: [0x0f, 2, 24, 6] },
            { colorIndexes: [0x0f, 3, 35, 7] },
            { colorIndexes: [0x0f, 4, 39, 8] }
          ]
        }
      ],
      currentCollectionId: "0"
    }
  },
  patternTables: {
    background: {
      tables: BACKGROUND_PATTERN_TABLE_OPTIONS,
      currentTableId: BACKGROUND_PATTERN_TABLE_OPTIONS[0].id
    },
    sprite: {
      tables: BACKGROUND_PATTERN_TABLE_OPTIONS,
      currentTableId: BACKGROUND_PATTERN_TABLE_OPTIONS[0].id
    }
  },
  nametables: [
    {
      id: "0",
      label: "Nametable 0",
      tileIndexes: new Uint8Array(960),
      paletteIndexes: new Uint8Array(64)
    }
  ],
  currentNametableId: "0"
};

function paletteCollectionSliceReducer(
  state: PaletteCollectionState,
  action: Action
): PaletteCollectionState {
  switch (action.type) {
    case ActionTypes.SELECT_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        currentCollectionId: collectionMatch.id
      };
    }
    case ActionTypes.ADD_NEW_PALETTE_COLLECTION: {
      const newCollection: GamePaletteCollection = {
        id: uuidv4(),
        label: action.payload.label,
        gamePalettes: [
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] },
          { colorIndexes: [0x0f, 0x0f, 0x0f, 0x0f] }
        ]
      };
      return {
        ...state,
        collections: [...state.collections, newCollection],
        currentCollectionId: newCollection.id
      };
    }
    case ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        collections: state.collections.map(collection =>
          collection.id === collectionMatch.id
            ? { ...collection, label: action.payload.label }
            : collection
        )
      };
    }
    case ActionTypes.COPY_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      const newCollection = {
        ...cloneDeep(collectionMatch),
        id: uuidv4(),
        label: collectionMatch.label + " Copy"
      };
      return {
        ...state,
        collections: [...state.collections, newCollection],
        currentCollectionId: newCollection.id
      };
    }
    case ActionTypes.DELETE_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.collections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      const newCollections = state.collections.filter(
        collection => collection.id !== collectionMatch.id
      );
      return {
        ...state,
        collections: newCollections,
        currentCollectionId:
          state.currentCollectionId === collectionMatch.id
            ? isEmpty(newCollections)
              ? null
              : newCollections[0].id
            : state.currentCollectionId
      };
    }
    case ActionTypes.CHANGE_GAME_PALETTE_COLOR: {
      const {
        paletteCollectionId,
        gamePaletteIndex,
        valueIndex,
        newColor
      } = action.payload;

      const collectionMatch = find(
        state.collections,
        collection => collection.id === paletteCollectionId
      );
      if (!collectionMatch) {
        return state;
      }

      return {
        ...state,
        collections: state.collections.map(collection => {
          if (collection.id !== collectionMatch.id) {
            return collection;
          }
          return {
            ...collection,
            gamePalettes: collection.gamePalettes.map((palette, index) => {
              const paletteIndexMatch = index === gamePaletteIndex;
              const changingFirstColor = valueIndex === 0;

              if (paletteIndexMatch || changingFirstColor) {
                const colorIndexes = palette.colorIndexes.slice();
                colorIndexes[valueIndex] = newColor.id;
                return {
                  ...palette,
                  colorIndexes
                };
              }

              return palette;
            })
          };
        })
      };
    }
    default:
      return state;
  }
}

function patternTableSliceReducer(
  state: PatternTableState,
  action: Action
): PatternTableState {
  switch (action.type) {
    case ActionTypes.SELECT_PATTERN_TABLE: {
      const tableMatch = find(
        state.tables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      return {
        ...state,
        currentTableId: tableMatch.id
      };
    }
    case ActionTypes.ADD_NEW_PATTERN_TABLE: {
      const newTable: PatternTable = {
        id: uuidv4(),
        label: action.payload.label,
        tiles: range(0, 256).map(() => ({
          pixels: new Uint8Array(64)
        }))
      };
      return {
        ...state,
        tables: [...state.tables, newTable],
        currentTableId: newTable.id
      };
    }
    case ActionTypes.UPDATE_PATTERN_TABLE_METADATA: {
      const tableMatch = find(
        state.tables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      return {
        ...state,
        tables: state.tables.map(table => {
          if (table.id !== tableMatch.id) {
            return table;
          }
          return {
            ...table,
            label: action.payload.label
          };
        })
      };
    }
    case ActionTypes.COPY_PATTERN_TABLE: {
      const tableMatch = find(
        state.tables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      const newTable = {
        ...cloneDeep(tableMatch),
        id: uuidv4(),
        label: tableMatch.label + " Copy"
      };
      return {
        ...state,
        tables: [...state.tables, newTable],
        currentTableId: newTable.id
      };
    }
    case ActionTypes.DELETE_PATTERN_TABLE: {
      const tableMatch = find(
        state.tables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      const newTables = state.tables.filter(
        table => table.id !== tableMatch.id
      );
      return {
        ...state,
        tables: newTables,
        currentTableId:
          state.currentTableId === tableMatch.id
            ? isEmpty(newTables)
              ? null
              : newTables[0].id
            : state.currentTableId
      };
    }
    case ActionTypes.CHANGE_PATTERN_TABLE_PIXELS: {
      const { tableId, tileIndex, startPixelIndex, newPixels } = action.payload;

      const tableMatch = find(state.tables, table => table.id === tableId);
      if (!tableMatch) {
        return state;
      }

      return {
        ...state,
        tables: state.tables.map(table => {
          if (table.id !== tableMatch.id) {
            return table;
          }
          return {
            ...table,
            tiles: table.tiles.map((tile, index) => {
              if (index !== tileIndex) {
                return tile;
              }
              const pixels = new Uint8Array(tile.pixels);
              pixels.set(newPixels, startPixelIndex);
              return { ...tile, pixels };
            })
          };
        })
      };
    }
    default:
      return state;
  }
}

function systemPaletteSliceReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.SELECT_SYSTEM_PALETTE: {
      const paletteMatch = find(
        state.systemPalettes,
        table => table.id === action.payload.id
      );
      if (!paletteMatch) {
        return state;
      }
      return {
        ...state,
        currentSystemPaletteId: paletteMatch.id
      };
    }
    default:
      return state;
  }
}

function nametableSliceReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.SELECT_NAMETABLE: {
      const nametableMatch = find(
        state.nametables,
        table => table.id === action.payload.id
      );
      if (!nametableMatch) {
        return state;
      }
      return {
        ...state,
        currentNametableId: nametableMatch.id
      };
    }
    case ActionTypes.ADD_NEW_NAMETABLE: {
      const newNametable = {
        id: uuidv4(),
        label: action.payload.label,
        tileIndexes: new Uint8Array(960),
        paletteIndexes: new Uint8Array(64)
      };
      return {
        ...state,
        nametables: [...state.nametables, newNametable],
        currentNametableId: newNametable.id
      };
    }
    case ActionTypes.UPDATE_NAMETABLE_METADATA: {
      const nametableMatch = find(
        state.nametables,
        table => table.id === action.payload.id
      );
      if (!nametableMatch) {
        return state;
      }
      return {
        ...state,
        nametables: state.nametables.map(nametable => {
          if (nametable.id !== nametableMatch.id) {
            return nametable;
          }
          return {
            ...nametable,
            label: action.payload.label
          };
        })
      };
    }
    case ActionTypes.COPY_NAMETABLE: {
      const nametableMatch = find(
        state.nametables,
        table => table.id === action.payload.id
      );
      if (!nametableMatch) {
        return state;
      }
      const newNametable = {
        ...cloneDeep(nametableMatch),
        id: uuidv4(),
        label: nametableMatch.label + " Copy"
      };
      return {
        ...state,
        nametables: [...state.nametables, newNametable],
        currentNametableId: newNametable.id
      };
    }
    case ActionTypes.DELETE_NAMETABLE: {
      const nametableMatch = find(
        state.nametables,
        table => table.id === action.payload.id
      );
      if (!nametableMatch) {
        return state;
      }
      const newNametables = state.nametables.filter(
        table => table.id !== nametableMatch.id
      );
      return {
        ...state,
        nametables: newNametables,
        currentNametableId:
          state.currentNametableId === nametableMatch.id
            ? isEmpty(newNametables)
              ? null
              : newNametables[0].id
            : state.currentNametableId
      };
    }
    case ActionTypes.CHANGE_NAMETABLE_TILE_INDEX: {
      const { nametableId, tileIndex, newValue } = action.payload;
      const nametableMatch = find(
        state.nametables,
        table => table.id === nametableId
      );
      if (!nametableMatch) {
        return state;
      }
      return {
        ...state,
        nametables: state.nametables.map(nametable => {
          if (nametable.id !== nametableMatch.id) {
            return nametable;
          }
          const tileIndexes = new Uint8Array(nametable.tileIndexes);
          tileIndexes.set([newValue], tileIndex);
          return { ...nametable, tileIndexes };
        })
      };
    }
    case ActionTypes.CHANGE_NAMETABLE_PALETTE_INDEX: {
      const { nametableId, paletteIndex, newValue } = action.payload;
      const nametableMatch = find(
        state.nametables,
        table => table.id === nametableId
      );
      if (!nametableMatch) {
        return state;
      }
      return {
        ...state,
        nametables: state.nametables.map(nametable => {
          if (nametable.id !== nametableMatch.id) {
            return nametable;
          }
          const paletteIndexes = new Uint8Array(nametable.paletteIndexes);
          paletteIndexes.set([newValue], paletteIndex);
          return { ...nametable, paletteIndexes };
        })
      };
    }
    default:
      return state;
  }
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ActionTypes.SELECT_SYSTEM_PALETTE:
      return systemPaletteSliceReducer(state, action);
    case ActionTypes.SELECT_PALETTE_COLLECTION:
    case ActionTypes.ADD_NEW_PALETTE_COLLECTION:
    case ActionTypes.COPY_PALETTE_COLLECTION:
    case ActionTypes.DELETE_PALETTE_COLLECTION:
    case ActionTypes.CHANGE_GAME_PALETTE_COLOR:
      return {
        ...state,
        paletteCollections: {
          ...state.paletteCollections,
          [action.payload.type]: paletteCollectionSliceReducer(
            state.paletteCollections[action.payload.type],
            action
          )
        }
      };
    case ActionTypes.SELECT_PATTERN_TABLE:
    case ActionTypes.ADD_NEW_PATTERN_TABLE:
    case ActionTypes.UPDATE_PATTERN_TABLE_METADATA:
    case ActionTypes.COPY_PATTERN_TABLE:
    case ActionTypes.DELETE_PATTERN_TABLE:
    case ActionTypes.CHANGE_PATTERN_TABLE_PIXELS:
      return {
        ...state,
        patternTables: {
          ...state.patternTables,
          [action.payload.type]: patternTableSliceReducer(
            state.patternTables[action.payload.type],
            action
          )
        }
      };
    case ActionTypes.SELECT_NAMETABLE:
    case ActionTypes.ADD_NEW_NAMETABLE:
    case ActionTypes.UPDATE_NAMETABLE_METADATA:
    case ActionTypes.COPY_NAMETABLE:
    case ActionTypes.DELETE_NAMETABLE:
      return nametableSliceReducer(state, action);

    // case ActionTypes.CHANGE_BACKGROUND_METATILE_SIZE:
    //   const newMetatileSize = action.payload;
    //   const { metatileSize, row, column } = state.currentBackgroundMetatile;
    //   if (newMetatileSize === metatileSize) {
    //     return state;
    //   }
    //   if (newMetatileSize < metatileSize) {
    //     return {
    //       ...state,
    //       currentBackgroundMetatile: {
    //         metatileSize: newMetatileSize,
    //         row: row * (metatileSize / newMetatileSize),
    //         column: column * (metatileSize / newMetatileSize)
    //       }
    //     };
    //   }
    //   return {
    //     ...state,
    //     currentBackgroundMetatile: {
    //       metatileSize: newMetatileSize,
    //       row: Math.floor(row / newMetatileSize),
    //       column: Math.floor(column / newMetatileSize)
    //     }
    //   };
    // case ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE:
    //   return {
    //     ...state,
    //     currentBackgroundMetatile: {
    //       ...state.currentBackgroundMetatile,
    //       ...action.payload
    //     }
    //   };
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

export const selectCurrentBackgroundPaletteCollection = createSelector(
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

export const selectCurrentSpritePaletteCollection = createSelector(
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

// export function selectCurrentBackgroundMetatile(state: State) {
//   return state.currentBackgroundMetatile;
// }

// export const selectCurrentBackgroundMetatileTiles = createSelector(
//   selectCurrentBackgroundPatternTable,
//   selectCurrentBackgroundMetatile,
//   (patternTable, metatile) => {
//     const indexes = getTileIndexesForMetatile(metatile);
//     return indexes.map(index => patternTable.tiles[index]);
//   }
// );

// function getTileIndexesForMetatile(metatile: Metatile) {
//   const result = [];

//   const startIndex =
//     metatile.row * metatile.metatileSize * 16 +
//     metatile.column * metatile.metatileSize;

//   for (let row = 0; row < metatile.metatileSize; ++row) {
//     for (let column = 0; column < metatile.metatileSize; ++column) {
//       result.push(startIndex + row * 16 + column);
//     }
//   }

//   return result;
// }

// export const selectCurrentBackgroundMetatilePalette = createSelector(
//   selectCurrentBackgroundMetatileTiles,
//   selectBackgroundPalettes,
//   (tiles, backgroundPalettes) =>
//     backgroundPalettes.find(palette => palette.id === tiles[0].gamePaletteId)
// );
