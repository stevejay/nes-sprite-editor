import React from "react";
import TileCanvas from "../../../shared/TileCanvas";
import {
  PATTERN_TABLE_COLUMNS,
  PATTERN_TABLE_ROWS,
  TILE_SIZE_PIXELS
} from "../constants";
import {
  GamePaletteWithColors,
  PatternTable as PatternTableType
} from "../store";
import PatternTableCanvas from "./PatternTableCanvas";

type Props = {
  scale: number;
  patternTable: PatternTableType;
  palette: GamePaletteWithColors;
  tileIndex: number;
  containerClassName?: string;
  onSelectTile: (index: number) => void;
};

const PatternTable = ({
  scale,
  patternTable,
  palette,
  tileIndex,
  containerClassName,
  onSelectTile
}: Props) => {
  const row = Math.floor(tileIndex / PATTERN_TABLE_COLUMNS);
  const column = tileIndex % PATTERN_TABLE_COLUMNS;
  return (
    <TileCanvas.Container className={containerClassName}>
      <PatternTableCanvas
        scale={scale}
        tiles={patternTable.tiles}
        palette={palette}
      />
      <TileCanvas.InteractionTracker
        rows={PATTERN_TABLE_ROWS}
        columns={PATTERN_TABLE_COLUMNS}
        row={row}
        column={column}
        onSelect={(row, column) => {
          onSelectTile(row * PATTERN_TABLE_COLUMNS + column);
        }}
      >
        <TileCanvas.Highlight
          tileWidth={TILE_SIZE_PIXELS * scale}
          tileHeight={TILE_SIZE_PIXELS * scale}
          row={row}
          column={column}
          aria-label={`Tile ${tileIndex}, row ${row}, column ${column}`}
        />
      </TileCanvas.InteractionTracker>
    </TileCanvas.Container>
  );
};

export default PatternTable;
