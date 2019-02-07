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
  values: Array<Color>; // 64 colors
};

export type GamePalette = {
  colorIndexes: Array<Color["id"]>; // 4 color ids
};

export type GamePaletteWithColors = GamePalette & {
  colors: Array<Color>;
};

export type GamePaletteType = "background" | "sprite";

export type Entity = {
  id: string;
  label: string;
};

export type GamePaletteCollection = Entity & {
  id: string;
  label: string;
  gamePalettes: Array<GamePalette>; // 4 palettes
};

export type GamePaletteCollectionWithColors = {
  id: GamePaletteCollection["id"];
  label: GamePaletteCollection["label"];
  gamePalettes: Array<GamePaletteWithColors>;
};

// 8x8 area of pixels
export type PatternTile = {
  pixels: Uint8Array; // 64 pixels, each value 0 to 3 (palette index)
};

export type PatternTableType = "background" | "sprite";

// 16x16 area of pattern tiles
export type PatternTable = Entity & {
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
export type Nametable = Entity & {
  id: string;
  label: string;
  tileIndexes: Uint8Array; // 960 bytes
  paletteIndexes: Uint8Array; // 64 bytes, 4 color index in each byte
};
