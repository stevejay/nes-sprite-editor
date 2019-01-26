import React from "react";
import { Tile, Color } from "../../types";
import { GamePaletteWithColors, Position } from "../../reducer";
import {
  TileInteractionTracker,
  TileCanvas,
  SelectedTile,
  Container
} from "../../shared/TileCanvas";

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  metatileSize: number;
  scaling: number;
  tiles: Array<Tile>;
  selectedMetatile: Position;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  onSelectedMetatileChange: (value: Position) => void;
};

const BackgroundPatternTable: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  metatileSize,
  scaling,
  tiles,
  selectedMetatile,
  backgroundColor,
  palettes,
  onSelectedMetatileChange
}) => (
  <Container>
    <TileInteractionTracker
      rows={tilesInRow / metatileSize}
      columns={tilesInColumn / metatileSize}
      row={selectedMetatile.row}
      column={selectedMetatile.column}
      onChange={(row, column) => onSelectedMetatileChange({ row, column })}
    >
      <TileCanvas
        tilesInRow={tilesInRow}
        tilesInColumn={tilesInColumn}
        scaling={scaling}
        tiles={tiles}
        backgroundColor={backgroundColor}
        palettes={palettes}
        ariaLabel="Pattern table tiles"
      />
      <SelectedTile
        tileWidth={8 * scaling * metatileSize}
        tileHeight={8 * scaling * metatileSize}
        row={selectedMetatile.row}
        column={selectedMetatile.column}
        ariaLabel={`Metatile row ${selectedMetatile.row}, column ${
          selectedMetatile.column
        }`}
      />
    </TileInteractionTracker>
  </Container>
);

export default BackgroundPatternTable;
