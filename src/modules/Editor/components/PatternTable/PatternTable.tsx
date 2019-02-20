import React from "react";
import TileCanvas from "../../../../shared/TileCanvas";
import {
  GamePaletteWithColors,
  PatternTable as PatternTableType,
  GamePaletteCollectionWithColors
} from "../../store";
import PatternTableCanvas from "./PatternTableCanvas";
import PaletteSelectionToolbar from "../../components/PaletteSelectionToolbar";
import Toolbar from "../../components/Toolbar";
import TileSelectionTool from "./TileSelectionTool";

type Props = {
  scale: number;
  patternTable: PatternTableType;
  paletteCollection: GamePaletteCollectionWithColors;
  paletteIndex: number;
  palette: GamePaletteWithColors;
  tileIndex: number;
  containerClassName?: string;
  onTileSelected: (index: number) => void;
  onPaletteSelected: (index: number) => void;
};

const PatternTable = ({
  scale,
  patternTable,
  paletteCollection,
  paletteIndex,
  palette,
  tileIndex,
  containerClassName,
  onTileSelected,
  onPaletteSelected
}: Props) => (
  <>
    <Toolbar.Container>
      <PaletteSelectionToolbar
        paletteIndex={paletteIndex}
        paletteCollection={paletteCollection}
        onPaletteSelected={onPaletteSelected}
      />
    </Toolbar.Container>
    <TileCanvas.Container className={containerClassName}>
      <PatternTableCanvas
        scale={scale}
        tiles={patternTable.tiles}
        palette={palette}
      />
      <TileSelectionTool
        scale={scale}
        tileIndex={tileIndex}
        onTileSelected={onTileSelected}
      />
    </TileCanvas.Container>
  </>
);

export default PatternTable;
