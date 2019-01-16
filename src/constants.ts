import { SystemPalette } from "./types";

const PALETTE_2C02_PPU: SystemPalette = {
  id: "2C02-ppu",
  label: "2C02 PPU (NES)",
  values: [
    // Luminosity=0
    { id: 0, available: true, name: "Mid Grey #1", rgb: [84, 84, 84] },
    {
      id: 1,
      available: true,
      name: "Blue Luminosity Level 0",
      rgb: [0, 30, 116]
    },
    {
      id: 2,
      available: true,
      name: "Indigo Luminosity Level 0",
      rgb: [8, 16, 144]
    },
    {
      id: 3,
      available: true,
      name: "Violet Luminosity Level 0",
      rgb: [48, 0, 136]
    },
    {
      id: 4,
      available: true,
      name: "Grape Luminosity Level 0",
      rgb: [68, 0, 100]
    },
    {
      id: 5,
      available: true,
      name: "Cranberry Luminosity Level 0",
      rgb: [92, 0, 48]
    },
    {
      id: 6,
      available: true,
      name: "Pink Luminosity Level 0",
      rgb: [84, 4, 0]
    },
    {
      id: 7,
      available: true,
      name: "Orange Luminosity Level 0",
      rgb: [60, 24, 0]
    },
    {
      id: 8,
      available: true,
      name: "Mustard Luminosity Level 0",
      rgb: [32, 42, 0]
    },
    {
      id: 9,
      available: true,
      name: "Yellow Green Luminosity Level 0",
      rgb: [8, 58, 0]
    },
    {
      id: 10,
      available: true,
      name: "Green Luminosity Level 0",
      rgb: [0, 64, 0]
    },
    {
      id: 11,
      available: true,
      name: "Jade Luminosity Level 0",
      rgb: [0, 60, 0]
    },
    {
      id: 12,
      available: true,
      name: "Aqua Luminosity Level 0",
      rgb: [0, 50, 60]
    },
    { id: 13, available: false },
    { id: 14, available: false },
    { id: 15, available: true, name: "Black #1", rgb: [0, 0, 0] },
    // Luminosity=1
    { id: 16, available: true, name: "Light Grey #1", rgb: [152, 150, 152] },
    {
      id: 17,
      available: true,
      name: "Blue Luminosity Level 1",
      rgb: [8, 76, 196]
    },
    {
      id: 18,
      available: true,
      name: "Indigo Luminosity Level 1",
      rgb: [48, 50, 236]
    },
    {
      id: 19,
      available: true,
      name: "Violet Luminosity Level 1",
      rgb: [92, 30, 228]
    },
    {
      id: 20,
      available: true,
      name: "Grape Luminosity Level 1",
      rgb: [136, 20, 176]
    },
    {
      id: 21,
      available: true,
      name: "Cranberry Luminosity Level 1",
      rgb: [160, 20, 100]
    },
    {
      id: 22,
      available: true,
      name: "Pink Luminosity Level 1",
      rgb: [152, 34, 32]
    },
    {
      id: 23,
      available: true,
      name: "Orange Luminosity Level 1",
      rgb: [120, 60, 0]
    },
    {
      id: 24,
      available: true,
      name: "Mustard Luminosity Level 1",
      rgb: [84, 90, 0]
    },
    {
      id: 25,
      available: true,
      name: "Yellow Green Luminosity Level 1",
      rgb: [40, 114, 0]
    },
    {
      id: 26,
      available: true,
      name: "Green Luminosity Level 1",
      rgb: [8, 124, 0]
    },
    {
      id: 27,
      available: true,
      name: "Jade Luminosity Level 1",
      rgb: [0, 118, 40]
    },
    {
      id: 28,
      available: true,
      name: "Aqua Luminosity Level 1",
      rgb: [0, 102, 120]
    },
    { id: 29, available: true, name: "Black #2", rgb: [0, 0, 0] },
    { id: 30, available: false },
    { id: 31, available: false },
    // Luminosity=2
    { id: 32, available: true, name: "Almost White #1", rgb: [236, 238, 236] },
    {
      id: 33,
      available: true,
      name: "Blue Luminosity Level 2",
      rgb: [76, 154, 236]
    },
    {
      id: 34,
      available: true,
      name: "Indigo Luminosity Level 2",
      rgb: [120, 124, 236]
    },
    {
      id: 35,
      available: true,
      name: "Violet Luminosity Level 2",
      rgb: [176, 98, 236]
    },
    {
      id: 36,
      available: true,
      name: "Grape Luminosity Level 2",
      rgb: [228, 84, 236]
    },
    {
      id: 37,
      available: true,
      name: "Cranberry Luminosity Level 2",
      rgb: [236, 88, 180]
    },
    {
      id: 38,
      available: true,
      name: "Pink Luminosity Level 2",
      rgb: [236, 106, 100]
    },
    {
      id: 39,
      available: true,
      name: "Orange Luminosity Level 2",
      rgb: [212, 136, 32]
    },
    {
      id: 40,
      available: true,
      name: "Mustard Luminosity Level 2",
      rgb: [160, 170, 0]
    },
    {
      id: 41,
      available: true,
      name: "Yellow Green Luminosity Level 2",
      rgb: [116, 196, 0]
    },
    {
      id: 42,
      available: true,
      name: "Green Luminosity Level 2",
      rgb: [76, 208, 32]
    },
    {
      id: 43,
      available: true,
      name: "Jade Luminosity Level 2",
      rgb: [56, 204, 108]
    },
    {
      id: 44,
      available: true,
      name: "Aqua Luminosity Level 2",
      rgb: [56, 180, 204]
    },
    { id: 45, available: true, name: "Mid Grey #2", rgb: [60, 60, 60] },
    { id: 46, available: false },
    { id: 47, available: false },
    // Luminosity=3
    { id: 48, available: true, name: "Almost White #2", rgb: [236, 238, 236] },
    {
      id: 49,
      available: true,
      name: "Blue Luminosity Level 3",
      rgb: [168, 204, 236]
    },
    {
      id: 50,
      available: true,
      name: "Indigo Luminosity Level 3",
      rgb: [188, 188, 236]
    },
    {
      id: 51,
      available: true,
      name: "Violet Luminosity Level 3",
      rgb: [212, 178, 236]
    },
    {
      id: 52,
      available: true,
      name: "Grape Luminosity Level 3",
      rgb: [236, 174, 236]
    },
    {
      id: 53,
      available: true,
      name: "Cranberry Luminosity Level 3",
      rgb: [236, 174, 212]
    },
    {
      id: 54,
      available: true,
      name: "Pink Luminosity Level 3",
      rgb: [236, 180, 176]
    },
    {
      id: 55,
      available: true,
      name: "Orange Luminosity Level 3",
      rgb: [228, 196, 144]
    },
    {
      id: 56,
      available: true,
      name: "Mustard Luminosity Level 3",
      rgb: [204, 210, 120]
    },
    {
      id: 57,
      available: true,
      name: "Yellow Green Luminosity Level 3",
      rgb: [180, 222, 120]
    },
    {
      id: 58,
      available: true,
      name: "Green Luminosity Level 3",
      rgb: [168, 226, 144]
    },
    {
      id: 59,
      available: true,
      name: "Jade Luminosity Level 3",
      rgb: [152, 226, 180]
    },
    {
      id: 60,
      available: true,
      name: "Aqua Luminosity Level 3",
      rgb: [160, 214, 228]
    },
    { id: 61, available: true, name: "Light Grey #2", rgb: [160, 162, 160] },
    { id: 62, available: false },
    { id: 63, available: false }
  ]
};

const SYSTEM_PALETTE_OPTIONS: Array<SystemPalette> = [PALETTE_2C02_PPU];

if (process.env.NODE_ENV === "development") {
  Object.freeze(SYSTEM_PALETTE_OPTIONS);
}

export { SYSTEM_PALETTE_OPTIONS };
