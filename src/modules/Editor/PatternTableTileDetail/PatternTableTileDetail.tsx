import React from "react";
import styles from "./PatternTableTileDetail.module.scss";
import { GamePaletteWithColors, PatternTable, Nametable } from "../store";
import Tile from "./Tile";
import TileCanvas from "../../../shared/TileCanvas";
import { filter } from "lodash";

type Props = {
  scale: number;
  tileIndex: number;
  currentPatternTable: PatternTable;
  currentNametable: Nametable | null;
  palette: GamePaletteWithColors;
};

const PatternTableTileDetail = ({
  scale,
  tileIndex,
  currentPatternTable,
  currentNametable,
  palette
}: Props) => {
  const tile = currentPatternTable.tiles[tileIndex];
  const tileUsageCount = React.useMemo<number>(
    () =>
      currentNametable
        ? filter(currentNametable.tileIndexes, index => index === tileIndex)
            .length
        : 0,
    [currentNametable, tileIndex]
  );
  return (
    <div className={styles.container}>
      <TileCanvas.Container>
        <Tile
          scale={scale}
          tile={tile}
          palette={palette}
          aria-label={`Tile number ${tileIndex}`}
        />
      </TileCanvas.Container>
      <div>
        <h4>Tile #{tileIndex}</h4>
        <p>
          <span>{tileUsageCount || "No"}</span>{" "}
          {tileUsageCount === 1 ? "usage" : "usages"} in current nametable
        </p>
      </div>
    </div>
  );
};

export default PatternTableTileDetail;
