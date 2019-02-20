import {
  GamePaletteCollectionWithColors,
  GamePaletteWithColors
} from "../types";
import formatByteAsHex from "../../../../shared/utils/format-byte-as-hex";

export default function createPaletteAsmContent(
  backgroundPaletteCollection: GamePaletteCollectionWithColors,
  spritePaletteCollection: GamePaletteCollectionWithColors
) {
  return `palette:

  ; background palettes
${backgroundPaletteCollection.gamePalettes.map(createPaletteEntry).join("\n")}

  ; sprite palettes
${spritePaletteCollection.gamePalettes.map(createPaletteEntry).join("\n")}
`;
}

function createPaletteEntry(gamePalette: GamePaletteWithColors): string {
  const colorIndexes = gamePalette.colorIndexes
    .map(colorIndex => "$" + formatByteAsHex(colorIndex))
    .join(",");
  return `  .db ${colorIndexes}`;
}
