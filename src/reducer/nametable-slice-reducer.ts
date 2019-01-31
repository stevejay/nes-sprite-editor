import { cloneDeep, find, isEmpty } from "lodash";
import uuidv4 from "uuid/v4";
import { Action, ActionTypes, State } from "./types";

export default function nametableSliceReducer(
  state: State,
  action: Action
): State {
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
