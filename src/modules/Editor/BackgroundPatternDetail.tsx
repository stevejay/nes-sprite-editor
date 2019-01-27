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
};

const BackgroundPatternDetail: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  currentMetatile,
  palettes
}) => {
  const [currentPixel, setCurrentPixel] = React.useState({ row: 0, column: 0 });

  return (
    <Container>
      <TileInteractionTracker
        rows={currentMetatile.metatileSize * 8}
        columns={currentMetatile.metatileSize * 8}
        row={currentPixel.row}
        column={currentPixel.column}
        onSelect={(row, column) => setCurrentPixel({ row, column })}
      >
        <TileCanvas
          tilesInRow={tilesInRow}
          tilesInColumn={tilesInColumn}
          scaling={scaling}
          tiles={tiles}
          palettes={palettes}
          ariaLabel={`Pixels of metatile row ${currentMetatile.row}, column ${
            currentMetatile.column
          }`}
        />
        <SelectedTile
          tileWidth={scaling}
          tileHeight={scaling}
          row={currentPixel.row}
          column={currentPixel.column}
          ariaLabel="todo"
          focusOnly
        />
      </TileInteractionTracker>
    </Container>
  );
};

export default BackgroundPatternDetail;
