import React from "react";
import { Tile, Color, Metatile } from "../../types";
import { GamePaletteWithColors } from "../../reducer";
import {
  TileInteractionTracker,
  TileCanvas,
  SelectedTile,
  Container
} from "../../shared/TileCanvas";

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scaling: number;
  tiles: Array<Tile>;
  currentMetatile: Metatile;
  palettes: Array<GamePaletteWithColors>;
  onSelectMetatile: (row: Metatile["row"], column: Metatile["column"]) => void;
};

const BackgroundPatternTable: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  currentMetatile,
  palettes,
  onSelectMetatile
}) => (
  <Container>
    <TileInteractionTracker
      rows={tilesInRow / currentMetatile.metatileSize}
      columns={tilesInColumn / currentMetatile.metatileSize}
      row={currentMetatile.row}
      column={currentMetatile.column}
      onSelect={onSelectMetatile}
    >
      <TileCanvas
        tilesInRow={tilesInRow}
        tilesInColumn={tilesInColumn}
        scaling={scaling}
        tiles={tiles}
        palettes={palettes}
        ariaLabel="Pattern table tiles"
      />
      <SelectedTile
        tileWidth={8 * scaling * currentMetatile.metatileSize}
        tileHeight={8 * scaling * currentMetatile.metatileSize}
        row={currentMetatile.row}
        column={currentMetatile.column}
        ariaLabel={`Metatile row ${currentMetatile.row}, column ${
          currentMetatile.column
        }`}
      />
    </TileInteractionTracker>
  </Container>
);

export default BackgroundPatternTable;