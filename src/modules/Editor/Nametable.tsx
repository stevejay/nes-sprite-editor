import React from "react";
import styles from "./Nametable.module.scss";
import {
  Container,
  TileInteractionTracker,
  SelectedTile
} from "../../shared/TileCanvas";
import { Nametable as NametableType, PatternTable } from "../../types";
import { GamePaletteCollectionWithColors } from "../../reducer";
import NametableCanvas from "./NametableCanvas";

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
};

const Nametable: React.FunctionComponent<Props> = ({
  nametable,
  patternTable,
  paletteCollection
}) => {
  if (!nametable || !patternTable || !paletteCollection) {
    return null;
  }

  const currentTile = { row: 0, column: 0 };
  const scaling = 3;

  return (
    <Container>
      <TileInteractionTracker
        rows={16}
        columns={16}
        row={0}
        column={0}
        onSelect={() => {}}
      >
        <NametableCanvas
          tilesInRow={30}
          tilesInColumn={32}
          scaling={scaling}
          nametable={nametable}
          patternTiles={patternTable.tiles}
          palettes={paletteCollection.gamePalettes}
          ariaLabel="Nametable tiles"
        />
        <SelectedTile
          tileWidth={16 * scaling}
          tileHeight={16 * scaling}
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

export default Nametable;
