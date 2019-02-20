import createPaletteAsmFileContent from "../create-palette-asm-file-content";
import { GamePaletteCollectionWithColors } from "../../types";

test("creates correct file content", () => {
  const backgroundPaletteCollection: GamePaletteCollectionWithColors = {
    type: "background",
    id: "1",
    label: "Backgrounds",
    gamePalettes: [
      { colorIndexes: [0x0f, 19, 20, 21], colors: [] },
      { colorIndexes: [0x0f, 23, 24, 25], colors: [] },
      { colorIndexes: [0x0f, 0x30, 0x23, 0x16], colors: [] },
      { colorIndexes: [0x0f, 38, 39, 40], colors: [] }
    ]
  };

  const spritePaletteCollection: GamePaletteCollectionWithColors = {
    type: "sprite",
    id: "2",
    label: "Sprites",
    gamePalettes: [
      { colorIndexes: [0x0f, 1, 20, 5], colors: [] },
      { colorIndexes: [0x0f, 2, 24, 6], colors: [] },
      { colorIndexes: [0x0f, 3, 35, 7], colors: [] },
      { colorIndexes: [0x0f, 4, 39, 8], colors: [] }
    ]
  };

  const actual = createPaletteAsmFileContent(
    backgroundPaletteCollection,
    spritePaletteCollection
  );
  expect(actual).toEqual(`palette:

  ; background palettes
  .db $0F,$13,$14,$15
  .db $0F,$17,$18,$19
  .db $0F,$30,$23,$16
  .db $0F,$26,$27,$28

  ; sprite palettes
  .db $0F,$01,$14,$05
  .db $0F,$02,$18,$06
  .db $0F,$03,$23,$07
  .db $0F,$04,$27,$08
`);
});
