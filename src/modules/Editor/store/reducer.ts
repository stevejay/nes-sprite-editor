import { cloneDeep, find, isEmpty, range } from "lodash";
import uuidv4 from "uuid/v4";
import { Action, ActionTypes, State } from "./types";
import {
  SYSTEM_PALETTE_OPTIONS,
  BACKGROUND_PATTERN_TABLE_OPTIONS
} from "../../../model";
import { GamePaletteCollection, PatternTable } from "../../../model";

export const initialState: State = {
  nametables: [
    {
      id: "0",
      label: "Nametable 0",
      tileIndexes: new Uint8Array(960),
      paletteIndexes: new Uint8Array(64 * 4)
    }
  ],
  selectedNametableId: "0",
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  selectedSystemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  paletteCollections: [
    {
      type: "background",
      id: "0",
      label: "Backgrounds #0",
      gamePalettes: [
        { colorIndexes: [0x0f, 19, 20, 21] },
        { colorIndexes: [0x0f, 23, 24, 25] },
        { colorIndexes: [0x0f, 0x30, 0x23, 0x16] },
        { colorIndexes: [0x0f, 38, 39, 40] }
      ]
    },
    {
      type: "sprite",
      id: "1",
      label: "Sprites #0",
      gamePalettes: [
        { colorIndexes: [0x0f, 1, 20, 5] },
        { colorIndexes: [0x0f, 2, 24, 6] },
        { colorIndexes: [0x0f, 3, 35, 7] },
        { colorIndexes: [0x0f, 4, 39, 8] }
      ]
    }
  ],
  selectedPaletteCollectionIds: {
    background: "0",
    sprite: "1"
  },
  patternTables: BACKGROUND_PATTERN_TABLE_OPTIONS,
  selectedPatternTableIds: {
    background: BACKGROUND_PATTERN_TABLE_OPTIONS[0].id,
    sprite: null
  }
};

initialState.nametables[0].tileIndexes.fill(1);
initialState.nametables[0].tileIndexes.set([4], 0);
initialState.nametables[0].tileIndexes.set([4], 13 * 32 + 13);
initialState.nametables[0].tileIndexes.set([4], 13 * 32 + 18);
initialState.nametables[0].tileIndexes.set([4], 16 * 32 + 13);
initialState.nametables[0].tileIndexes.set([4], 16 * 32 + 18);

initialState.nametables[0].paletteIndexes.set([1], 64 * 2 - 8);
initialState.nametables[0].paletteIndexes.set([3], 64 * 2 - 9);

export function reducer(state: State = initialState, action: Action): State {
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
        selectedSystemPaletteId: paletteMatch.id
      };
    }
    case ActionTypes.SELECT_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [collectionMatch.type]: collectionMatch.id
        }
      };
    }
    case ActionTypes.ADD_NEW_PALETTE_COLLECTION: {
      const newCollection: GamePaletteCollection = {
        type: action.payload.type,
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
        paletteCollections: [...state.paletteCollections, newCollection],
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [action.payload.type]: newCollection.id
        }
      };
    }
    case ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        paletteCollections: state.paletteCollections.map(collection =>
          collection.id === collectionMatch.id
            ? { ...collection, label: action.payload.label }
            : collection
        )
      };
    }
    case ActionTypes.COPY_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.paletteCollections,
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
        paletteCollections: [...state.paletteCollections, newCollection],
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [newCollection.type]: newCollection.id
        }
      };
    }
    case ActionTypes.DELETE_PALETTE_COLLECTION: {
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === action.payload.id
      );
      if (!collectionMatch) {
        return state;
      }
      const newCollections = state.paletteCollections.filter(
        collection => collection.id !== collectionMatch.id
      );
      const fallbackCollection = find(
        newCollections,
        collection => collection.type === collectionMatch.type
      );
      const currentCollectionId =
        state.selectedPaletteCollectionIds[collectionMatch.type];
      return {
        ...state,
        paletteCollections: newCollections,
        selectedPaletteCollectionIds: {
          ...state.selectedPaletteCollectionIds,
          [collectionMatch.type]:
            currentCollectionId === collectionMatch.id
              ? fallbackCollection
                ? fallbackCollection.id
                : null
              : currentCollectionId
        }
      };
    }
    case ActionTypes.CHANGE_GAME_PALETTE_COLOR: {
      const { id, gamePaletteIndex, valueIndex, newColor } = action.payload;
      const collectionMatch = find(
        state.paletteCollections,
        collection => collection.id === id
      );
      if (!collectionMatch) {
        return state;
      }
      return {
        ...state,
        paletteCollections: state.paletteCollections.map(collection => {
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
    case ActionTypes.SELECT_PATTERN_TABLE: {
      const tableMatch = find(
        state.patternTables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      return {
        ...state,
        selectedPatternTableIds: {
          ...state.selectedPatternTableIds,
          [tableMatch.type]: tableMatch.id
        }
      };
    }
    case ActionTypes.ADD_NEW_PATTERN_TABLE: {
      const newTable: PatternTable = {
        type: action.payload.type,
        id: uuidv4(),
        label: action.payload.label,
        tiles: range(0, 256).map(() => ({
          pixels: new Uint8Array(64)
        }))
      };
      return {
        ...state,
        patternTables: [...state.patternTables, newTable],
        selectedPatternTableIds: {
          ...state.selectedPatternTableIds,
          [newTable.type]: newTable.id
        }
      };
    }
    case ActionTypes.UPDATE_PATTERN_TABLE_METADATA: {
      const tableMatch = find(
        state.patternTables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      return {
        ...state,
        patternTables: state.patternTables.map(table => {
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
        state.patternTables,
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
        patternTables: [...state.patternTables, newTable],
        selectedPatternTableIds: {
          ...state.selectedPatternTableIds,
          [newTable.type]: newTable.id
        }
      };
    }
    case ActionTypes.DELETE_PATTERN_TABLE: {
      const tableMatch = find(
        state.patternTables,
        table => table.id === action.payload.id
      );
      if (!tableMatch) {
        return state;
      }
      const newTables = state.patternTables.filter(
        table => table.id !== tableMatch.id
      );
      const fallbackTable = find(
        newTables,
        collection => collection.type === tableMatch.type
      );
      const currentCollectionId =
        state.selectedPatternTableIds[tableMatch.type];
      return {
        ...state,
        patternTables: newTables,
        selectedPatternTableIds: {
          ...state.selectedPatternTableIds,
          [tableMatch.type]:
            currentCollectionId === tableMatch.id
              ? fallbackTable
                ? fallbackTable.id
                : null
              : currentCollectionId
        }
      };
    }
    case ActionTypes.CHANGE_PATTERN_TABLE_PIXELS: {
      const { id, tileIndex, startPixelIndex, newPixels } = action.payload;
      const tableMatch = find(state.patternTables, table => table.id === id);
      if (!tableMatch) {
        return state;
      }
      return {
        ...state,
        patternTables: state.patternTables.map(table => {
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
        selectedNametableId: nametableMatch.id
      };
    }
    case ActionTypes.ADD_NEW_NAMETABLE: {
      const newNametable = {
        id: uuidv4(),
        label: action.payload.label,
        tileIndexes: new Uint8Array(960),
        paletteIndexes: new Uint8Array(64 * 4)
      };
      return {
        ...state,
        nametables: [...state.nametables, newNametable],
        selectedNametableId: newNametable.id
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
        selectedNametableId: newNametable.id
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
        selectedNametableId:
          state.selectedNametableId === nametableMatch.id
            ? isEmpty(newNametables)
              ? null
              : newNametables[0].id
            : state.selectedNametableId
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
