import { filter } from "lodash";
import React from "react";
import { FiLock } from "react-icons/fi";
import Button from "../../../shared/Button";
import TileCanvas from "../../../shared/TileCanvas";
import Toolbar from "../components/Toolbar";
import { GamePaletteWithColors, Nametable, PatternTable } from "../store";
import styles from "./PatternTableTileDetail.module.scss";
import Tile from "./Tile";

type Props = {
  scale: number;
  tileIndex: number;
  currentPatternTable: PatternTable;
  currentNametable: Nametable | null;
  palette: GamePaletteWithColors;
  onUpdateLocked: (isLocked: boolean) => void;
};

const PatternTableTileDetail = ({
  scale,
  tileIndex,
  currentPatternTable,
  currentNametable,
  palette,
  onUpdateLocked
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
    <>
      <h3>Selected Tile</h3>
      <div className={styles.container}>
        <div className={styles.column}>
          <TileCanvas.Container>
            <Tile
              scale={scale}
              tile={tile}
              palette={palette}
              aria-label={`Tile number ${tileIndex}`}
            />
            {tile.isLocked && <FiLock className={styles.lockIndicator} />}
          </TileCanvas.Container>
        </div>
        <div className={styles.column}>
          <p className={styles.statistic}>
            <span>{tileUsageCount || "No"}</span>{" "}
            {tileUsageCount === 1 ? "Usage" : "Usages"}
          </p>
          <Toolbar.Container>
            <Toolbar>
              <Button
                aria-label={`${
                  tile.isLocked ? "Unlock" : "Lock"
                } selected tile`}
                onClick={() => onUpdateLocked(!tile.isLocked)}
              >
                {tile.isLocked ? "Unlock" : "Lock"}
              </Button>
            </Toolbar>
          </Toolbar.Container>
        </div>
      </div>
    </>
  );
};

export default React.memo(
  PatternTableTileDetail,
  (prevProps, nextProps) =>
    prevProps.tileIndex === nextProps.tileIndex &&
    prevProps.currentPatternTable === nextProps.currentPatternTable &&
    prevProps.currentNametable === nextProps.currentNametable &&
    prevProps.palette === nextProps.palette
);
