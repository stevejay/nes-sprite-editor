import { cloneDeep, find, isEmpty, range } from "lodash";
import uuidv4 from "uuid/v4";
import { PatternTable } from "../types";
import { Action, ActionTypes, PatternTableState } from "./types";

export default function patternTableSliceReducer(
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
