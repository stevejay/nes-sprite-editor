import { find } from "lodash";
import { Action, ActionTypes, State } from "./types";

export default function systemPaletteSliceReducer(
  state: State,
  action: Action
): State {
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
