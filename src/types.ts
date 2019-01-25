import { Tuple } from "./typescript";

export type ColorId = number;

export type Color =
  | {
      available: false;
      id: ColorId;
    }
  | {
      available: true;
      id: ColorId;
      name: string;
      rgb: string;
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
  rowIndex: number; // 0 to 15 - ditch?
  columnIndex: number; // 0 to 15 - ditch?
  gamePaletteId: GamePalette["id"]; // 0 to 3
  pixels: Uint8Array; // 64 pixels, each value 0 to 3 (palette index)
};

export type TileGrid = {
  id: string;
  label: string;
  tiles: Tuple<Tile, 256>; // 16 by 16
};
