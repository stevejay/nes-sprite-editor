import { GamePaletteWithColors } from "../../reducer";
import formatByteAsHex from "../../shared/utils/format-byte-as-hex";
import { Color, TileGrid } from "../../types";

export default function createGameDataText(
  backgroundColor: Color,
  backgroundPalettes: Array<GamePaletteWithColors>,
  spritePalettes: Array<GamePaletteWithColors>
): string {
  // Note: might be '.byte' instead of '.db':

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

function createGamePaletteData(
  gamePalette: GamePaletteWithColors,
  backgroundColor: Color
): string {
  const gamePaletteColors = gamePalette.values
    .map(value => `$${formatByteAsHex(value)}`)
    .join(",");
  return `$${formatByteAsHex(backgroundColor.id)},${gamePaletteColors}`;
}
