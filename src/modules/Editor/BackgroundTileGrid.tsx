import React, { useEffect } from "react";
import styles from "./BackgroundTileGrid.module.scss";
import { TileGrid, Color } from "../../types";
import { GamePaletteWithColors } from "../../reducer";
import { SYSTEM_PALETTE_OPTIONS } from "../../constants";
import formatRgbValueAsString from "../../shared/utils/format-rgb-value-as-string";

const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const GRID_TILE_WIDTH = 16;
const GRID_TILE_HEIGHT = 16;

type Props = {
  backgroundTileGrid: TileGrid;
  backgroundColor: Color;
  backgroundPalettes: Array<GamePaletteWithColors>;
  gridScaling: number;
};

const BackgroundTileGrid: React.FunctionComponent<Props> = ({
  backgroundTileGrid,
  backgroundColor,
  backgroundPalettes,
  gridScaling
}) => {
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = React.useRef(
    null
  );

  const canvasSize = React.useMemo(
    () => ({
      width: TILE_PIXEL_WIDTH * GRID_TILE_WIDTH * gridScaling,
      height: TILE_PIXEL_HEIGHT * GRID_TILE_HEIGHT * gridScaling
    }),
    [gridScaling]
  );

  React.useLayoutEffect(
    () => {
      if (canvasRef && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.style.width = canvasSize.width + "px";
          canvas.style.height = canvasSize.height + "px";

          var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
          canvas.width = canvasSize.width * scale;
          canvas.height = canvasSize.height * scale;
          ctx.scale(scale, scale);

          backgroundTileGrid.tiles.forEach(tile => {
            const palette = backgroundPalettes[tile.gamePaletteId];
            let rowIndex = -1;
            tile.pixels.forEach((pixelColorIndex, index) => {
              const columnIndex = index % 8;
              if (columnIndex === 0) {
                ++rowIndex;
              }

              const color =
                pixelColorIndex === 0
                  ? backgroundColor
                  : palette.colors[pixelColorIndex - 1];

              const rgbString = color.available
                ? formatRgbValueAsString(color.rgb)
                : "#FFF";

              ctx.fillStyle = rgbString;
              ctx.fillRect(
                (tile.columnIndex * 8 + columnIndex) * gridScaling,
                (tile.rowIndex * 8 + rowIndex) * gridScaling,
                gridScaling,
                gridScaling
              );
            });
          });
        }
      }
    },
    [backgroundTileGrid, backgroundColor, backgroundPalettes, gridScaling]
  );

  return (
    <canvas ref={canvasRef} style={canvasSize} className={styles.canvas} />
  );
};

export default BackgroundTileGrid;
