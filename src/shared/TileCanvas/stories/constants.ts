import { GamePaletteTypes, Color } from "../../../types";
import { GamePaletteWithColors } from "../../../reducer";

export const COLOR_GRAPE: Color = {
  id: 36,
  available: true,
  name: "Grape Luminosity Level 2",
  rgb: "#E454EC"
};

export const COLOR_PINK: Color = {
  id: 38,
  available: true,
  name: "Pink Luminosity Level 2",
  rgb: "#EC6A64"
};

export const COLOR_JADE: Color = {
  id: 43,
  available: true,
  name: "Jade Luminosity Level 2",
  rgb: "#38CC6C"
};

export const COLOR_ALMOST_WHITE: Color = {
  id: 32,
  available: true,
  name: "Almost White #1",
  rgb: "#ECEEEC"
};

export const BACKGROUND_PALETTE: GamePaletteWithColors = {
  type: GamePaletteTypes.BACKGROUND,
  id: 0,
  values: [COLOR_GRAPE.id, COLOR_PINK.id, COLOR_JADE.id],
  colors: [COLOR_GRAPE, COLOR_PINK, COLOR_JADE]
};

export const GRAPE_PIXELS = new Uint8Array(64);
GRAPE_PIXELS.fill(2);

export const PINK_PIXELS = new Uint8Array(64);
PINK_PIXELS.fill(1);

export const JADE_PIXELS = new Uint8Array(64);
JADE_PIXELS.fill(3);