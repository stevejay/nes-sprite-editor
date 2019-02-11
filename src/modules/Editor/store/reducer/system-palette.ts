import { find } from "lodash";
import { Action, ActionTypes, State } from "../types";
import { SYSTEM_PALETTE_OPTIONS } from "../../constants";

export const initialState: Partial<State> = {
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  selectedSystemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id
};

export function reducer(state: State, action: Action): State {
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
    default:
      return state;
  }
}
