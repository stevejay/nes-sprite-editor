import {
  BACKGROUND_PATTERN_TABLE_OPTIONS,
  SYSTEM_PALETTE_OPTIONS
} from "../constants";
import nametableSliceReducer from "./nametable-slice-reducer";
import paletteCollectionSliceReducer from "./pattern-collection-slice-reducer";
import patternTableSliceReducer from "./pattern-table-slice-reducer";
import systemPaletteSliceReducer from "./system-palette-slice-reducer";
import { Action, ActionTypes, State } from "./types";

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
      paletteIndexes: new Uint8Array(64 * 4)
    }
  ],
  currentNametableId: "0"
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
    case ActionTypes.SELECT_SYSTEM_PALETTE:
      return systemPaletteSliceReducer(state, action);
    case ActionTypes.SELECT_PALETTE_COLLECTION:
    case ActionTypes.ADD_NEW_PALETTE_COLLECTION:
    case ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA:
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
    case ActionTypes.CHANGE_NAMETABLE_TILE_INDEX:
    case ActionTypes.CHANGE_NAMETABLE_PALETTE_INDEX:
      return nametableSliceReducer(state, action);
    default:
      return state;
  }
}
