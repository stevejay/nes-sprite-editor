import { range } from "lodash";
import deepFreeze from "@ef-carbon/deep-freeze";
import { SystemPalette, PatternTile, PatternTable } from "./store";

// TODO alternative system palette color values here:
// http://nesdev.com/NESTechFAQ.htm#howmanycolours

const PALETTE_2C02_PPU: SystemPalette = {
  id: "2C02-ppu",
  label: "2C02 PPU (NES)",
  values: [
    // Luminosity=0
    { id: 0, available: true, name: "Mid Grey #1", rgb: "#545454" },
    {
      id: 1,
      available: true,
      name: "Blue Luminosity Level 0",
      rgb: "#001E74"
    },
    {
      id: 2,
      available: true,
      name: "Indigo Luminosity Level 0",
      rgb: "#081090"
    },
    {
      id: 3,
      available: true,
      name: "Violet Luminosity Level 0",
      rgb: "#300088"
    },
    {
      id: 4,
      available: true,
      name: "Grape Luminosity Level 0",
      rgb: "#440064"
    },
    {
      id: 5,
      available: true,
      name: "Cranberry Luminosity Level 0",
      rgb: "#5C0030"
    },
    {
      id: 6,
      available: true,
      name: "Pink Luminosity Level 0",
      rgb: "#540400"
    },
    {
      id: 7,
      available: true,
      name: "Orange Luminosity Level 0",
      rgb: "#3C1800"
    },
    {
      id: 8,
      available: true,
      name: "Mustard Luminosity Level 0",
      rgb: "#202A00"
    },
    {
      id: 9,
      available: true,
      name: "Yellow Green Luminosity Level 0",
      rgb: "#083A00"
    },
    {
      id: 10,
      available: true,
      name: "Green Luminosity Level 0",
      rgb: "#004000"
    },
    {
      id: 11,
      available: true,
      name: "Jade Luminosity Level 0",
      rgb: "#003C00"
    },
    {
      id: 12,
      available: true,
      name: "Aqua Luminosity Level 0",
      rgb: "#00323C"
    },
    { id: 13, available: false },
    { id: 14, available: true, name: "Black Copy #1", rgb: "#000" },
    { id: 15, available: true, name: "Canonical Black", rgb: "#000" },
    // Luminosity=1
    { id: 16, available: true, name: "Light Grey #1", rgb: "#989698" },
    {
      id: 17,
      available: true,
      name: "Blue Luminosity Level 1",
      rgb: "#084CC4"
    },
    {
      id: 18,
      available: true,
      name: "Indigo Luminosity Level 1",
      rgb: "#3032EC"
    },
    {
      id: 19,
      available: true,
      name: "Violet Luminosity Level 1",
      rgb: "#5C1EE4"
    },
    {
      id: 20,
      available: true,
      name: "Grape Luminosity Level 1",
      rgb: "#8814B0"
    },
    {
      id: 21,
      available: true,
      name: "Cranberry Luminosity Level 1",
      rgb: "#A01464"
    },
    {
      id: 22,
      available: true,
      name: "Pink Luminosity Level 1",
      rgb: "#982220"
    },
    {
      id: 23,
      available: true,
      name: "Orange Luminosity Level 1",
      rgb: "#783C00"
    },
    {
      id: 24,
      available: true,
      name: "Mustard Luminosity Level 1",
      rgb: "#545A00"
    },
    {
      id: 25,
      available: true,
      name: "Yellow Green Luminosity Level 1",
      rgb: "#287200"
    },
    {
      id: 26,
      available: true,
      name: "Green Luminosity Level 1",
      rgb: "#087C00"
    },
    {
      id: 27,
      available: true,
      name: "Jade Luminosity Level 1",
      rgb: "#007628"
    },
    {
      id: 28,
      available: true,
      name: "Aqua Luminosity Level 1",
      rgb: "#006678"
    },
    { id: 29, available: true, name: "Black Copy #2", rgb: "#000" },
    { id: 30, available: true, name: "Black Copy #3", rgb: "#000" },
    { id: 31, available: true, name: "Black Copy #4", rgb: "#000" },
    // Luminosity=2
    { id: 32, available: true, name: "Almost White #1", rgb: "#ECEEEC" },
    {
      id: 33,
      available: true,
      name: "Blue Luminosity Level 2",
      rgb: "#4C9AEC"
    },
    {
      id: 34,
      available: true,
      name: "Indigo Luminosity Level 2",
      rgb: "#787CEC"
    },
    {
      id: 35,
      available: true,
      name: "Violet Luminosity Level 2",
      rgb: "#B062EC"
    },
    {
      id: 36,
      available: true,
      name: "Grape Luminosity Level 2",
      rgb: "#E454EC"
    },
    {
      id: 37,
      available: true,
      name: "Cranberry Luminosity Level 2",
      rgb: "#EC58B4"
    },
    {
      id: 38,
      available: true,
      name: "Pink Luminosity Level 2",
      rgb: "#EC6A64"
    },
    {
      id: 39,
      available: true,
      name: "Orange Luminosity Level 2",
      rgb: "#D48820"
    },
    {
      id: 40,
      available: true,
      name: "Mustard Luminosity Level 2",
      rgb: "#A0AA00"
    },
    {
      id: 41,
      available: true,
      name: "Yellow Green Luminosity Level 2",
      rgb: "#74C400"
    },
    {
      id: 42,
      available: true,
      name: "Green Luminosity Level 2",
      rgb: "#4CD020"
    },
    {
      id: 43,
      available: true,
      name: "Jade Luminosity Level 2",
      rgb: "#38CC6C"
    },
    {
      id: 44,
      available: true,
      name: "Aqua Luminosity Level 2",
      rgb: "#38B4CC"
    },
    { id: 45, available: true, name: "Mid Grey #2", rgb: "#3C3C3C" },
    { id: 46, available: true, name: "Black Copy #5", rgb: "#000" },
    { id: 47, available: true, name: "Black Copy #6", rgb: "#000" },
    // Luminosity=3
    { id: 48, available: true, name: "Almost White #2", rgb: "#ECEEEC" },
    {
      id: 49,
      available: true,
      name: "Blue Luminosity Level 3",
      rgb: "#A8CCEC"
    },
    {
      id: 50,
      available: true,
      name: "Indigo Luminosity Level 3",
      rgb: "#BCBCEC"
    },
    {
      id: 51,
      available: true,
      name: "Violet Luminosity Level 3",
      rgb: "#D4B2EC"
    },
    {
      id: 52,
      available: true,
      name: "Grape Luminosity Level 3",
      rgb: "#ECAEEC"
    },
    {
      id: 53,
      available: true,
      name: "Cranberry Luminosity Level 3",
      rgb: "#ECAED4"
    },
    {
      id: 54,
      available: true,
      name: "Pink Luminosity Level 3",
      rgb: "#ECB4B0"
    },
    {
      id: 55,
      available: true,
      name: "Orange Luminosity Level 3",
      rgb: "#E4C490"
    },
    {
      id: 56,
      available: true,
      name: "Mustard Luminosity Level 3",
      rgb: "#CCD278"
    },
    {
      id: 57,
      available: true,
      name: "Yellow Green Luminosity Level 3",
      rgb: "#B4DE78"
    },
    {
      id: 58,
      available: true,
      name: "Green Luminosity Level 3",
      rgb: "#A8E290"
    },
    {
      id: 59,
      available: true,
      name: "Jade Luminosity Level 3",
      rgb: "#98E2B4"
    },
    {
      id: 60,
      available: true,
      name: "Aqua Luminosity Level 3",
      rgb: "#A0D6E4"
    },
    { id: 61, available: true, name: "Light Grey #2", rgb: "#A0A2A0" },
    { id: 62, available: true, name: "Black Copy #7", rgb: "#000" },
    { id: 63, available: true, name: "Black Copy #8", rgb: "#000" }
  ]
};

const SYSTEM_PALETTE_OPTIONS: Array<SystemPalette> = [PALETTE_2C02_PPU];

if (process.env.NODE_ENV === "development") {
  deepFreeze(SYSTEM_PALETTE_OPTIONS);
}

export { SYSTEM_PALETTE_OPTIONS };

const BLANK_0_TILE_PIXELS: PatternTile["pixels"] = new Uint8Array(64);

const BLANK_1_TILE_PIXELS: PatternTile["pixels"] = new Uint8Array(64);
BLANK_1_TILE_PIXELS.fill(1);

const BLANK_2_TILE_PIXELS: PatternTile["pixels"] = new Uint8Array(64);
BLANK_2_TILE_PIXELS.fill(2);

const BLANK_3_TILE_PIXELS: PatternTile["pixels"] = new Uint8Array(64);
BLANK_3_TILE_PIXELS.fill(3);

const HEART_TILE_PIXELS: PatternTile["pixels"] = new Uint8Array([
  // 0
  0,
  3,
  3,
  0,
  0,
  3,
  3,
  0,
  // 1
  0,
  3,
  1,
  3,
  3,
  3,
  3,
  3,
  // 2
  3,
  1,
  3,
  3,
  3,
  3,
  3,
  3,
  // 3
  3,
  1,
  3,
  3,
  3,
  3,
  3,
  3,
  // 4
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  // 5
  0,
  3,
  3,
  3,
  3,
  3,
  3,
  0,
  // 6
  0,
  0,
  3,
  3,
  3,
  3,
  0,
  0,
  // 7
  0,
  0,
  0,
  3,
  3,
  0,
  0,
  0
]);

const BACKGROUND_PATTERN_TABLE_OPTIONS: Array<PatternTable> = [
  {
    type: "background",
    id: "background-1",
    label: "Background Grid 1",
    tiles: range(0, 256).map(index => ({
      row: Math.floor(index / 16),
      column: index % 16,
      gamePaletteId: 2,
      pixels:
        index === 1
          ? BLANK_1_TILE_PIXELS
          : index === 2
          ? BLANK_2_TILE_PIXELS
          : index === 3
          ? BLANK_3_TILE_PIXELS
          : index === 4
          ? HEART_TILE_PIXELS
          : BLANK_0_TILE_PIXELS
    })) as PatternTable["tiles"]
  }
];

if (process.env.NODE_ENV === "development") {
  deepFreeze(BACKGROUND_PATTERN_TABLE_OPTIONS);
}

export { BACKGROUND_PATTERN_TABLE_OPTIONS };

export const TOTAL_NAMETABLE_X_TILES = 32;
export const TOTAL_NAMETABLE_Y_TILES = 30;
export const TILE_SIZE_PIXELS = 8;
export const CANVAS_OVERDRAW_SCALING = 1;
export const PATTERN_TABLE_ROWS = 16;
export const PATTERN_TABLE_COLUMNS = 16;
