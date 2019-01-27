import { GamePaletteWithColors } from "../../reducer";
import formatByteAsHex from "../../shared/utils/format-byte-as-hex";
import { Color } from "../../types";

export default function createGameDataText(
  backgroundPalettes: Array<GamePaletteWithColors>,
  spritePalettes: Array<GamePaletteWithColors>
): string {
  // Note: might be '.byte' instead of '.db':

  return `;;; BANK 1 DATA

  .bank 1      ; change to bank 1
  .org $E000   ; start at $E000

PaletteData:

  ;; background palettes
  .db ${createGamePaletteData(backgroundPalettes[0])}
  .db ${createGamePaletteData(backgroundPalettes[1])}
  .db ${createGamePaletteData(backgroundPalettes[2])}
  .db ${createGamePaletteData(backgroundPalettes[3])}

  ;; sprite palettes
  .db ${createGamePaletteData(spritePalettes[0])}
  .db ${createGamePaletteData(spritePalettes[1])}
  .db ${createGamePaletteData(spritePalettes[2])}
  .db ${createGamePaletteData(spritePalettes[3])}
`;
}

function createGamePaletteData(gamePalette: GamePaletteWithColors): string {
  const gamePaletteColors = gamePalette.values
    .map(value => `$${formatByteAsHex(value)}`)
    .join(",");
  return `$${gamePaletteColors}`;
}
