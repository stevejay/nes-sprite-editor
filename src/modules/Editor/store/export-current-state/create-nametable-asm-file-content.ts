import { Nametable } from "../types";
import formatByteAsHex from "../../../../shared/utils/format-byte-as-hex";

export default function createNametableAsmContent(nametable: Nametable) {
  const lines = ["background:"];

  for (let row = 0; row < 30; ++row) {
    lines.push(
      `  .db ${createNametableTileLine(nametable.tileIndexes, row * 32)}`
    );

    lines.push(
      `  .db ${createNametableTileLine(
        nametable.tileIndexes,
        row * 32 + 16
      )}  ; row ${row + 1}`
    );

    lines.push("");
  }

  lines.push("");
  lines.push("attributes:");

  for (let row = 0; row < 8; ++row) {
    lines.push(
      `  .db ${createNametableAttributeLine(nametable.paletteIndexes, row)}`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function createNametableTileLine(
  tileIndexes: Uint8Array,
  offset: number
): string {
  const hexValues = [];
  for (let i = offset; i < offset + 16; ++i) {
    hexValues.push("$" + formatByteAsHex(tileIndexes[i]));
  }
  return hexValues.join(",");
}

function createNametableAttributeLine(paletteIndexes: Uint8Array, row: number) {
  const hexValues = [];

  for (let i = 0; i < 7; ++i) {
    const topLeft = row * 32 + i * 2;
    let value =
      (paletteIndexes[topLeft + 1] << 2) | (paletteIndexes[topLeft] << 0);

    if (row < 7) {
      value =
        value |
        (paletteIndexes[topLeft + 16 + 1] << 6) |
        (paletteIndexes[topLeft + 16] << 4);
    }

    hexValues.push("$" + formatByteAsHex(value));
  }

  return hexValues.join(",");
}
