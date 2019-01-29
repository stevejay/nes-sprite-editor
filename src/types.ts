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

export type SystemPalette = {
  id: string;
  label: string;
  values: Tuple<Color, 64>;
};

export type GamePalette = {
  colorIndexes: Array<Color["id"]>; // 4 color ids
};

export type GamePaletteType = "background" | "sprite";

export type GamePaletteCollection = {
  id: string;
  label: string;
  gamePalettes: Array<GamePalette>; // 4 palettes
};

// 8x8 area of pixels
export type PatternTile = {
  pixels: Uint8Array; // 64 pixels, each value 0 to 3 (palette index)
};

export type PatternTableType = "background" | "sprite";

// 16x16 area of pattern tiles
export type PatternTable = {
  id: string;
  label: string;
  tiles: Array<PatternTile>; // 256 tiles (16x16)
};

// export type PatternMetatile = {
//   metatileSize: 1 | 2;
//   row: number;
//   column: number;
// };

// 30x32 area of nametable tiles
export type Nametable = {
  id: string;
  label: string;
  tileIndexes: Uint8Array; // 960 - Tuple<PatternTileIndex, 960>;
  paletteIndexes: Uint8Array; // 64 - Tuple<number, 64>;
};

// export type Nametable = {
//   id: number;
//   label: string;
//   metatiles: Array<{ tileIndexes: Tuple<PatternTileIndex, 4>, paletteIndex: number }>
// }

// export type Nametable = {
//   id: number;
//   label: string;
//   tiles: Array<{ tileIndex: PatternTileIndex, paletteIndex: number }>
// }
