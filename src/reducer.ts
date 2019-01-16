import { createSelector } from "reselect";
import { GamePalette, SystemPalette, Color, GamePaletteTypes } from "./types";
import { SYSTEM_PALETTE_OPTIONS } from "./constants";

export enum ActionTypes {
  CHANGE_SYSTEM_PALETTE = "CHANGE_SYSTEM_PALETTE",
  CHANGE_BACKGROUND_COLOR = "CHANGE_BACKGROUND_COLOR",
  CHANGE_GAME_PALETTE_COLOR = "CHANGE_GAME_PALETTE_COLOR"
}

export type State = {
  systemPalettes: Array<SystemPalette>;
  systemPaletteId: SystemPalette["id"];
  backgroundColorId: Color["id"];
  gamePalettes: Array<GamePalette>;
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
  | { type: ActionTypes.CHANGE_GAME_PALETTE_COLOR; payload: GamePaletteChange };

export const initialState: State = {
  systemPalettes: SYSTEM_PALETTE_OPTIONS,
  systemPaletteId: SYSTEM_PALETTE_OPTIONS[0].id,
  backgroundColorId: 0,
  gamePalettes: [
    { type: GamePaletteTypes.BACKGROUND, id: 0, values: [19, 20, 21] },
    { type: GamePaletteTypes.BACKGROUND, id: 1, values: [23, 24, 25] },
    { type: GamePaletteTypes.BACKGROUND, id: 2, values: [34, 35, 36] },
    { type: GamePaletteTypes.BACKGROUND, id: 3, values: [38, 39, 40] },
    { type: GamePaletteTypes.SPRITE, id: 0, values: [1, 20, 5] },
    { type: GamePaletteTypes.SPRITE, id: 1, values: [2, 24, 6] },
    { type: GamePaletteTypes.SPRITE, id: 2, values: [3, 35, 7] },
    { type: GamePaletteTypes.SPRITE, id: 3, values: [4, 39, 8] }
  ]
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.CHANGE_SYSTEM_PALETTE:
      return { ...state, systemPaletteId: action.payload };
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
    default:
      return state;
  }
}

export function selectSystemPalettes(state: State) {
  return state.systemPalettes;
}

export function selectSystemPaletteId(state: State) {
  return state.systemPaletteId;
}

export function selectBackgroundColorId(state: State) {
  return state.backgroundColorId;
}

export function selectGamePalettes(state: State) {
  return state.gamePalettes;
}

export function selectSystemPalette(state: State) {
  const systemPalettes = selectSystemPalettes(state);
  const systemPaletteId = selectSystemPaletteId(state);
  return systemPalettes.find(x => x.id === systemPaletteId) as SystemPalette;
}

export const selectBackgroundColor = createSelector(
  selectSystemPalette,
  selectBackgroundColorId,
  (systemPalette, backgroundColorId) =>
    systemPalette.values.find(
      element => element.id === backgroundColorId
    ) as Color
);

export const selectBackgroundPalettes = createSelector(
  selectSystemPalette,
  selectGamePalettes,
  (systemPalette, gamePalettes) =>
    gamePalettes
      .filter(x => x.type === GamePaletteTypes.BACKGROUND)
      .sort(x => x.id)
      .map(gamePalette => mapToGamePaletteColors(gamePalette, systemPalette))
);

export const selectSpritePalettes = createSelector(
  selectSystemPalette,
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
