import React from "react";
import styles from "./TileDetail.module.scss";
import { useSizedCanvasEffect, drawTile } from "./TileGrid";
import { GamePaletteWithColors } from "../../reducer";
import { Tile, Color } from "../../types";

type Props = {
  rows: number;
  columns: number;
  tiles: Array<Tile>;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
};

const TileDetail: React.FunctionComponent<Props> = ({
  rows,
  columns,
  tiles,
  backgroundColor,
  palettes
}) => {
  const gridScaling = 4;
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    rows,
    columns,
    gridScaling
  );

  React.useLayoutEffect(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      tiles.forEach((tile, index) => {
        const palette = palettes[tile.gamePaletteId];
        drawTile(
          ctx,
          Math.floor(index / columns),
          index % columns,
          tile.pixels,
          [backgroundColor, ...palette.colors],
          gridScaling
        );
      });
    },
    [tiles, backgroundColor, palettes, gridScaling]
  );

  const handleContainerClick = undefined;
  const handleKeyDown = undefined;

  return (
    <div
      className={styles.container}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={canvasSize}
        role="img"
        aria-label="Selected background tile"
      />
    </div>
  );
};

export default TileDetail;
