import React from "react";
import styles from "./TileCanvas.module.scss";
import { GamePaletteWithColors } from "../../reducer";
import { Tile, Color } from "../../types";
import useSizedCanvasEffect from "../utils/use-sized-canvas-effect";
import useDrawTilesEffect from "./use-draw-tiles-effect";

type Props = {
  rows: number;
  columns: number;
  scaling: number;
  tiles: Array<Tile>;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  ariaLabel: string;
};

// A tile is an 8x8 pixel area. This component draws one or more
// on a canvas.
const TileCanvas: React.FunctionComponent<Props> = ({
  rows,
  columns,
  scaling,
  tiles,
  backgroundColor,
  palettes,
  ariaLabel
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSize = useSizedCanvasEffect(canvasRef, rows, columns, scaling);

  useDrawTilesEffect(
    canvasRef,
    tiles,
    backgroundColor,
    palettes,
    columns,
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
