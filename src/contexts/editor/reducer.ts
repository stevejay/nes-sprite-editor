import { cloneDeep, find, isEmpty } from "lodash";
import uuidv4 from "uuid/v4";
import { Action, ActionTypes, State } from "./types";
import {
  SYSTEM_PALETTE_OPTIONS,
  BACKGROUND_PATTERN_TABLE_OPTIONS
} from "../../constants";
import paletteCollectionSliceReducer from "./palette-collection-slice-reducer";
import patternTableSliceReducer from "./pattern-table-slice-reducer";

export const initialState: State = {
  nametables: [
    {
      id: "0",
      label: "Nametable 0",
      tileIndexes: new Uint8Array(960),
      paletteIndexes: new Uint8Array(64 * 4)
    }
  ],
  currentNametableId: "0",

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
        currentSystemPaletteId: paletteMatch.id
      };
    }
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
        paletteIndexes: new Uint8Array(64 * 4)
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
