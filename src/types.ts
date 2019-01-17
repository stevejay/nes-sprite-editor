import { Tuple } from "./typescript";

export type ColorId = number;
export type RGBValue = [number, number, number];

export type Color =
  | {
      available: false;
      id: ColorId;
    }
  | {
      available: true;
      id: ColorId;
      name: string;
      rgb: RGBValue;
    };

export enum GamePaletteTypes {
  BACKGROUND = "BACKGROUND",
  SPRITE = "SPRITE"
}

export type GamePalette = {
  type: GamePaletteTypes;
  id: number;
  values: Tuple<ColorId, 3>;
};

export type SystemPalette = {
  id: string;
  label: string;
  values: Tuple<Color, 64>;
};

// the screen is 32 tiles wide, 30 tiles tall
export type Tile = {
  rowIndex: number; // 0 to 15
  columnIndex: number; // 0 to 15
  gamePaletteId: GamePalette["id"]; // 0 to 3
  pixels: Tuple<number, 64>; // 64 pixels, each value 0 to 3 (palette index)
};

export type TileGrid = {
  id: string;
  label: string;
  tiles: Tuple<Tile, 256>; // 16 by 16
};
