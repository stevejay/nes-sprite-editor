import createPatternTableChrFileContent from "../create-pattern-table-chr-file-content";
import { PatternTable, PatternTile } from "../../types";
import { range } from "lodash";

const BLANK_0_TILE_PIXELS: PatternTile["pixels"] = 0;
const BLANK_1_TILE_PIXELS: PatternTile["pixels"] = 1;
const BLANK_2_TILE_PIXELS: PatternTile["pixels"] = 2;
const BLANK_3_TILE_PIXELS: PatternTile["pixels"] = 3;

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

const BACKGROUND_PATTERN_TABLE: PatternTable = {
  type: "background",
  id: "background-1",
  label: "Background Grid 1",
  tiles: range(0, 256).map(
    index =>
      ({
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
            : BLANK_0_TILE_PIXELS,
        isLocked: index <= 4
      } as PatternTile)
  )
};

test("creates correct file content", () => {
  const actual = createPatternTableChrFileContent(BACKGROUND_PATTERN_TABLE);
  expect(actual.length).toEqual(4096);
  const expectedStart = Uint8Array.from([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,

    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,

    102,
    254,
    255,
    255,
    255,
    126,
    60,
    24,
    102,
    250,
    253,
    253,
    255,
    126,
    60,
    24
  ]);
  expect(actual.slice(0, 80)).toEqual(expectedStart);
  expect(actual.slice(80)).toEqual(
    Uint8Array.from(range(0, 4096 - 80).map(() => 0))
  );
});
