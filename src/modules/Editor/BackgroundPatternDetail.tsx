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
  // metatileSize: number;
  scaling: number;
  tiles: Array<Tile>;
  currentMetatile: MetatileSelection;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  // onSelectMetatile: (value: MetatileSelection) => void;
};

const BackgroundPatternDetail: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  // metatileSize,
  scaling,
  tiles,
  currentMetatile,
  backgroundColor,
  palettes
  // onSelectMetatile
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
          backgroundColor={backgroundColor}
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
