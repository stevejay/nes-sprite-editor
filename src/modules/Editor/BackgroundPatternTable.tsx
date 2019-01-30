import React from "react";
import {
  GamePaletteWithColors,
  GamePaletteCollectionWithColors,
  Action
} from "../../reducer";
import {
  TileInteractionTracker,
  TileCanvas,
  SelectedTile,
  Container
} from "../../shared/TileCanvas";
import { PatternTable } from "../../types";

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
    // TODO default palette
    return null;
  }
  return (
    <Container>
      <TileInteractionTracker
        rows={16}
        columns={16}
        row={currentTile.row}
        column={currentTile.column}
        onSelect={onSelectTile}
      >
        <TileCanvas
          tilesInRow={16}
          tilesInColumn={16}
          scaling={scaling}
          tiles={patternTable.tiles}
          palettes={paletteCollection.gamePalettes}
          ariaLabel="Pattern table tiles"
        />
        <SelectedTile
          tileWidth={8 * scaling}
          tileHeight={8 * scaling}
          row={currentTile.row}
          column={currentTile.column}
          ariaLabel={`Metatile row ${currentTile.row}, column ${
            currentTile.column
          }`}
        />
      </TileInteractionTracker>
    </Container>
  );
};

export default BackgroundPatternTable;
