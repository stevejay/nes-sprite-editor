import formatByteAsHex from "../../shared/utils/format-byte-as-hex";
import {
  GamePaletteWithColors,
  GamePaletteCollectionWithColors
} from "../../types";

export default function createGameDataText(
  backgroundPaletteCollection: GamePaletteCollectionWithColors | null,
  spritePaletteCollection: GamePaletteCollectionWithColors | null
): string {
  if (!backgroundPaletteCollection || !spritePaletteCollection) {
    return "";
  }

  // Note: might be '.byte' instead of '.db':

  return `;;; BANK 1 DATA

  .bank 1      ; change to bank 1
  .org $E000   ; start at $E000

PaletteData:

  ;; background palettes
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[0])}
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[1])}
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[2])}
  .db ${createGamePaletteData(backgroundPaletteCollection.gamePalettes[3])}

  ;; sprite palettes
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[0])}
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[1])}
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[2])}
  .db ${createGamePaletteData(spritePaletteCollection.gamePalettes[3])}
`;
}

function createGamePaletteData(gamePalette: GamePaletteWithColors): string {
  const gamePaletteColors = gamePalette.colorIndexes
    .map(colorIndex => `$${formatByteAsHex(colorIndex)}`)
    .join(",");
  return `${gamePaletteColors}`;
}
