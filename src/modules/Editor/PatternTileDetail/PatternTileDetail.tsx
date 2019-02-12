import React from "react";
import styles from "./PatternTileDetail.module.scss";
import { PatternTile, GamePaletteWithColors } from "../store";
import Tile from "./Tile";
import TileCanvas from "../../../shared/TileCanvas";

type Props = {
  scale: number;
  tileIndex: number;
  tile: PatternTile;
  tileUsageCount: number;
  palette: GamePaletteWithColors;
};

const PatternTileDetail = ({
  scale,
  tileIndex,
  tile,
  tileUsageCount,
  palette
}: Props) => (
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

export default PatternTileDetail;
