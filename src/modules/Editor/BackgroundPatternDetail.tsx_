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
  onClicked: (tileIndex: number, pixelIndex: number) => void;
};

const BackgroundPatternDetail: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  currentMetatile,
  palettes,
  onClicked
}) => {
  const [currentPixel, setCurrentPixel] = React.useState({ row: 0, column: 0 });

  const handleSelect = (row: number, column: number, pressed: boolean) => {
    setCurrentPixel({ row, column });
    if (pressed) {
      const pixel = (row % 8) * 8 + (column % 8);

      const tileRow =
        currentMetatile.row * currentMetatile.metatileSize +
        Math.floor(row / 8);

      const tileColumn =
        currentMetatile.column * currentMetatile.metatileSize +
        Math.floor(column / 8);

      onClicked(tileRow * 16 + tileColumn, pixel);
    }
  };

  return (
    <Container>
      <TileInteractionTracker
        rows={currentMetatile.metatileSize * 8}
        columns={currentMetatile.metatileSize * 8}
        row={currentPixel.row}
        column={currentPixel.column}
        onSelect={handleSelect}
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
          ariaLabel="TODO"
          focusOnly
        />
      </TileInteractionTracker>
    </Container>
  );
};

export default BackgroundPatternDetail;
