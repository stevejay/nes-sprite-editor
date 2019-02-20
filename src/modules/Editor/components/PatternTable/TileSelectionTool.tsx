import React from "react";
import TileCanvas from "../../../../shared/TileCanvas";
import {
  PATTERN_TABLE_COLUMNS,
  PATTERN_TABLE_ROWS,
  TILE_SIZE_PIXELS
} from "../../constants";

type Props = {
  scale: number;
  tileIndex: number;
  onTileSelected: (index: number) => void;
};

const TileSelectionTool = ({ scale, tileIndex, onTileSelected }: Props) => {
  const row = Math.floor(tileIndex / PATTERN_TABLE_COLUMNS);
  const column = tileIndex % PATTERN_TABLE_COLUMNS;
  return (
    <TileCanvas.InteractionTracker
      rows={PATTERN_TABLE_ROWS}
      columns={PATTERN_TABLE_COLUMNS}
      row={row}
      column={column}
      onSelect={(row, column) => {
        onTileSelected(row * PATTERN_TABLE_COLUMNS + column);
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
  );
};

export default React.memo(
  TileSelectionTool,
  (prevProps, nextProps) => prevProps.tileIndex === nextProps.tileIndex
);
