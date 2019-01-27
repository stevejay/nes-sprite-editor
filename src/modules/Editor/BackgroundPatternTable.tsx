import React from "react";
import { Tile, Color } from "../../types";
import { GamePaletteWithColors, MetatileSelection } from "../../reducer";
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
  currentMetatile: MetatileSelection;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  onSelectMetatile: (
    row: MetatileSelection["row"],
    column: MetatileSelection["column"]
  ) => void;
};

const BackgroundPatternTable: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  currentMetatile,
  backgroundColor,
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
        backgroundColor={backgroundColor}
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
