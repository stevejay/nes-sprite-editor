import JSZip from "jszip";
import save from "save-file";
import {
  GamePaletteCollectionWithColors,
  Nametable,
  PatternTable
} from "../types";
import createPaletteAsmFileContent from "./create-palette-asm-file-content";
import createNametableAsmContent from "./create-nametable-asm-file-content";
import createPatternTableChrFileContent from "./create-pattern-table-chr-file-content";

export default async function exportCurrentState(
  backgroundPaletteCollection: GamePaletteCollectionWithColors | null,
  spritePaletteCollection: GamePaletteCollectionWithColors | null,
  backgroundPatternTable: PatternTable | null,
  nametable: Nametable | null
) {
  if (
    !backgroundPaletteCollection ||
    !spritePaletteCollection ||
    !backgroundPatternTable ||
    !nametable
  ) {
    return;
  }

  const zip = new JSZip();

  const paletteAsmFileContent = createPaletteAsmFileContent(
    backgroundPaletteCollection,
    spritePaletteCollection
  );
  zip.file("palette.asm", paletteAsmFileContent);

  const nametableAsmFileContent = createNametableAsmContent(nametable);
  zip.file("nametable.asm", nametableAsmFileContent);

  const backgroundChrFileContent = createPatternTableChrFileContent(
    backgroundPatternTable
  );
  zip.file("background.chr", backgroundChrFileContent);

  const zipped = await zip.generateAsync({ type: "blob" });
  await save(zipped, "result.zip");
}
