import { cloneDeep, find, range, isNumber } from "lodash";
import uuidv4 from "uuid/v4";
import { Action, ActionTypes, State, PatternTable } from "../types";
import { BACKGROUND_PATTERN_TABLE_OPTIONS } from "../../constants";

export const initialState: Partial<State> = {
  patternTables: BACKGROUND_PATTERN_TABLE_OPTIONS,
  selectedPatternTableIds: {
    background: BACKGROUND_PATTERN_TABLE_OPTIONS[0].id,
    sprite: null
  }
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
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
          pixels: 0,
          isLocked: false
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
      if (tableMatch.tiles[tileIndex].isLocked) {
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
              const sourcePixels = isNumber(tile.pixels)
                ? Uint8Array.from(range(0, 64).map(() => tile.pixels as number))
                : tile.pixels;
              const pixels = new Uint8Array(sourcePixels);
              pixels.set(newPixels, startPixelIndex);
              return {
                ...tile,
                pixels: pixels.every(value => value === pixels[0])
                  ? pixels[0]
                  : pixels
              };
            })
          };
        })
      };
    }
    case ActionTypes.CHANGE_PATTERN_TABLE_TILE_LOCK: {
      const { id, tileIndex, isLocked } = action.payload;
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
              return { ...tile, isLocked };
            })
          };
        })
      };
    }
    default:
      return state;
  }
}
