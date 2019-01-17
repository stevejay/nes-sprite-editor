import React from "react";
import styles from "./BackgroundTileGrid.module.scss";
import { TileGrid } from "../../types";
import { GamePaletteWithColors } from "../../reducer";

const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const GRID_TILE_WIDTH = 16;
const GRID_TILE_HEIGHT = 16;

type Props = {
  backgroundTileGrid: TileGrid;
  backgroundPalettes: Array<GamePaletteWithColors>;
  gridScaling: number;
};

const BackgroundTileGrid: React.FunctionComponent<Props> = ({
  gridScaling
}) => {
  const canvasStyle = React.useMemo(
    () => ({
      width: `${TILE_PIXEL_WIDTH * GRID_TILE_WIDTH * gridScaling}px`,
      height: `${TILE_PIXEL_HEIGHT * GRID_TILE_HEIGHT * gridScaling}px`
    }),
    [gridScaling]
  );

  return <canvas style={canvasStyle} className={styles.canvas} />;
};

export default BackgroundTileGrid;
