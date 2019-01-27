import { Tuple } from "./typescript";

export type Color =
  | {
      available: false;
      id: number;
    }
  | {
      available: true;
      id: number;
      name: string;
      rgb: string;
    };

export enum GamePaletteTypes {
  BACKGROUND = "BACKGROUND",
  SPRITE = "SPRITE"
}

export type GamePalette = {
  type: GamePaletteTypes;
  id: number; // [0, 3]
  values: Tuple<Color["id"], 4>;
};

export type SystemPalette = {
  id: string;
  label: string;
  values: Tuple<Color, 64>;
};

// A Tile is an 8 by 8 pixel area
export type Tile = {
  row: number; // 0 to 15 - TODO ditch?
  column: number; // 0 to 15 - TODO ditch?
  gamePaletteId: GamePalette["id"]; // 0 to 3
  pixels: Uint8Array; // 64 pixels, each value 0 to 3 (palette index)
};

export type PatternTable = {
  id: string;
  label: string;
  tiles: Tuple<Tile, 256>; // 16 by 16
};

export type Metatile = {
  metatileSize: 1 | 2;
  row: number;
  column: number;
};
