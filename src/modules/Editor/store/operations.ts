import JSZip from "jszip";
import { isNumber, range } from "lodash";
import save from "save-file";
import formatByteAsHex from "../../../shared/utils/format-byte-as-hex";
import { PATTERN_TABLE_COLUMNS } from "../constants";
import {
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentSpritePaletteCollection,
  selectCurrentNametable
} from "./selectors";
import {
  EditorStateSlice,
  GamePaletteCollectionWithColors,
  GamePaletteWithColors,
  PatternTable,
  PatternTile,
  Nametable
} from "./types";

export function exportStateForNES() {
  return async (_dispatch: any, getState: () => EditorStateSlice) => {
    const state = getState();
    const backgroundPaletteCollection = selectCurrentBackgroundPaletteCollection(
      state
    );
    const spritePaletteCollection = selectCurrentSpritePaletteCollection(state);
    const backgroundPatternTable = selectCurrentBackgroundPatternTable(state);
    const nametable = selectCurrentNametable(state);

    if (
      !backgroundPaletteCollection ||
      !spritePaletteCollection ||
      !backgroundPatternTable ||
      !nametable
    ) {
      return;
    }

    const zip = new JSZip();

    const paletteAsmContent = createPaletteAsmContent(
      backgroundPaletteCollection,
      spritePaletteCollection
    );
    zip.file("palette.asm", paletteAsmContent);

    const backgroundChrContent = createPatternTableData(backgroundPatternTable);
    zip.file("background.chr", backgroundChrContent);

    const nametableAsmContent = createNametableAsmContent(nametable);
    zip.file("nametable.asm", nametableAsmContent);

    const zipped = await zip.generateAsync({ type: "blob" });
    await save(zipped, "result.zip");
  };
}

function createPaletteAsmContent(
  backgroundPaletteCollection: GamePaletteCollectionWithColors,
  spritePaletteCollection: GamePaletteCollectionWithColors
) {
  return `palette:

  ; background
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[0])}
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[1])}
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[2])}
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[3])}

  ; sprites
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[0])}
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[1])}
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[2])}
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[3])}
`;
}

function createGamePaletteData(gamePalette: GamePaletteWithColors): string {
  return gamePalette.colorIndexes
    .map(colorIndex => `$${formatByteAsHex(colorIndex)}`)
    .join(",");
}

function createPatternTableData(patternTable: PatternTable): Uint8Array {
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

function createNametableAsmContent(nametable: Nametable) {
  const lines = ["background:"];

  for (let row = 0; row < 30; ++row) {
    lines.push(
      `  .db ${createNametableAsmLine(
        nametable.tileIndexes,
        row * 32
      )} ; row ${row + 1}`
    );
    lines.push(
      `  .db ${createNametableAsmLine(nametable.tileIndexes, row * 32 + 16)}`
    );
    lines.push("");
  }

  lines.push("");
  lines.push("attributes:");

  return lines.join("\n");
}

function createNametableAsmLine(
  tileIndexes: Uint8Array,
  offset: number
): string {
  const hexValues = [];
  for (let i = offset; i < offset + 16; ++i) {
    hexValues.push(formatByteAsHex(tileIndexes[i]));
  }
  return hexValues.join(",");
}
