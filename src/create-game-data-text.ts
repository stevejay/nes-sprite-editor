import { GamePaletteWithColors } from "./reducer";
import formatHex from "./format-hex";
import { Color } from "./types";

function createGamePaletteData(
  gamePalette: GamePaletteWithColors,
  backgroundColor: Color
): string {
  const gamePaletteColors = gamePalette.values
    .map(value => `$${formatHex(value)}`)
    .join(",");
  return `$${formatHex(backgroundColor.id)},${gamePaletteColors}`;
}

export default function createGameDataText(
  backgroundColor: Color,
  backgroundPalettes: Array<GamePaletteWithColors>,
  spritePalettes: Array<GamePaletteWithColors>
): string {
  return `;;; BANK 1 DATA

  .bank 1      ; change to bank 1
  .org $E000   ; start at $E000

PaletteData:

  ;; background palettes
  .db ${createGamePaletteData(backgroundPalettes[0], backgroundColor)}
  .db ${createGamePaletteData(backgroundPalettes[1], backgroundColor)}
  .db ${createGamePaletteData(backgroundPalettes[2], backgroundColor)}
  .db ${createGamePaletteData(backgroundPalettes[3], backgroundColor)}

  ;; sprite palettes
  .db ${createGamePaletteData(spritePalettes[0], backgroundColor)}
  .db ${createGamePaletteData(spritePalettes[1], backgroundColor)}
  .db ${createGamePaletteData(spritePalettes[2], backgroundColor)}
  .db ${createGamePaletteData(spritePalettes[3], backgroundColor)}
  `;
}
