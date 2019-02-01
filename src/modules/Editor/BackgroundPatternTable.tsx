import React from "react";
import { GamePaletteCollectionWithColors } from "../../reducer";
import TileCanvas from "../../shared/TileCanvas";
import { PatternTable } from "../../types";
import PatternTableCanvas from "./PatternTableCanvas";

type Props = {
  scaling: number;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  currentTile: { row: number; column: number };
  // dispatch: React.Dispatch<Action>;
  onSelectTile: (row: number, column: number) => void;
};

const BackgroundPatternTable: React.FunctionComponent<Props> = ({
  scaling,
  patternTable,
  paletteCollection,
  currentTile,
  onSelectTile
}) => {
  if (!patternTable || !paletteCollection) {
    // TODO default palette?
    return null;
  }

  return (
    <TileCanvas.Container>
      <TileCanvas.InteractionTracker
        rows={16}
        columns={16}
        row={currentTile.row}
        column={currentTile.column}
        onSelect={onSelectTile}
      >
        <PatternTableCanvas
          tilesInRow={16}
          tilesInColumn={16}
          scaling={scaling}
          tiles={patternTable.tiles}
          palette={paletteCollection.gamePalettes[0]}
          ariaLabel="Pattern table tiles"
        />
        <TileCanvas.Highlight
          tileWidth={8 * scaling}
          tileHeight={8 * scaling}
          row={currentTile.row}
          column={currentTile.column}
          ariaLabel={`Metatile row ${currentTile.row}, column ${
            currentTile.column
          }`}
        />
      </TileCanvas.InteractionTracker>
    </TileCanvas.Container>
  );
};

export default BackgroundPatternTable;
