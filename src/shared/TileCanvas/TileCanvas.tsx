import React from "react";
import styles from "./TileCanvas.module.scss";
import { GamePaletteWithColors } from "../../reducer";
import { Tile, Color } from "../../types";
import useSizedCanvasEffect from "../utils/use-sized-canvas-effect";
import useDrawTilesEffect from "./use-draw-tiles-effect";

const TILE_PIXEL_HEIGHT = 8;
const TILE_PIXEL_WIDTH = TILE_PIXEL_HEIGHT;

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scaling: number; // 1+
  tiles: Array<Tile>;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  ariaLabel: string;
};

const TileCanvas: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  backgroundColor,
  palettes,
  ariaLabel
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    tilesInRow,
    tilesInColumn,
    scaling * TILE_PIXEL_HEIGHT,
    scaling * TILE_PIXEL_WIDTH
  );

  useDrawTilesEffect(
    canvasRef,
    tiles,
    backgroundColor,
    palettes,
    tilesInColumn,
    scaling
  );

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={canvasSize}
      role="img"
      aria-label={ariaLabel}
    />
  );
};

export default TileCanvas;
