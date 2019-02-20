import { PatternTable, PatternTile } from "../types";
import { PATTERN_TABLE_COLUMNS } from "../../constants";
import { range, isNumber } from "lodash";

export default function createPatternTableChrFileContent(
  patternTable: PatternTable
): Uint8Array {
  const buffer = new ArrayBuffer(4096);
  const byteView = new Uint8Array(buffer);

  patternTable.tiles.forEach((tile, index) => {
    const tileByteOffset =
      (index % PATTERN_TABLE_COLUMNS) * PATTERN_TABLE_COLUMNS +
      Math.floor(index / PATTERN_TABLE_COLUMNS) * 256;

    // write first plane bytes for this tile
    range(0, 64, 8)
      .map(offset => createPatternTableByte(tile.pixels, offset, 1))
      .forEach((byte, index) => {
        byteView[tileByteOffset + index] = byte;
      });

    // write second plane bytes for this tile
    range(0, 64, 8)
      .map(offset => createPatternTableByte(tile.pixels, offset, 2))
      .forEach((byte, index) => {
        byteView[tileByteOffset + 8 + index] = byte;
      });
  });

  return byteView;
}

function createPatternTableByte(
  pixels: PatternTile["pixels"],
  offset: number,
  mask: number
) {
  let result = 0;
  for (let i = 0; i < 8; ++i) {
    const pixel = isNumber(pixels) ? pixels : pixels[offset + i];
    if (pixel & mask) {
      result = result | (1 << i);
    }
  }
  return result;
}
