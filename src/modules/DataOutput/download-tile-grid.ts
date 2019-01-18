import { range } from "lodash";
import sync from "save-file";
import { TileGrid, Tile } from "../../types";

export default function downloadTileGrid(
  tileGrid: TileGrid,
  fileNameNoExt?: string
): Promise<void> {
  const buffer = new ArrayBuffer(16 * 16 * 16); // 4096 bytes
  const byteView = new Uint8Array(buffer);

  tileGrid.tiles.forEach(tile => {
    const tileByteOffset = tile.columnIndex * 16 + tile.rowIndex * 16 * 16;

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

  return new Promise(resolve => {
    sync(byteView, `${fileNameNoExt || tileGrid.id}.chr`, resolve);
  });
}

function createPatternTableByte(
  pixels: Tile["pixels"],
  offset: number,
  mask: number
) {
  let result = 0;
  for (let i = 0; i < 8; ++i) {
    const pixel = pixels[offset + i];
    if (pixel & mask) {
      result = result | (1 << i);
    }
  }
  return result;
}
