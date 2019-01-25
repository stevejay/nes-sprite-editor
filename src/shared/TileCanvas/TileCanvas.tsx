import React from "react";
import styles from "./TileCanvas.module.scss";
import { GamePaletteWithColors } from "../../reducer";
import { Tile, Color } from "../../types";
import useSizedCanvas from "../utils/use-sized-canvas";
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
  const canvasSize = useSizedCanvas(canvasRef, rows, columns, scaling);

  console.log("canvasSize", rows, columns, canvasSize);

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
