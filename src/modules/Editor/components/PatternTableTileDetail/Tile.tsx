import React from "react";
import useSizedCanvasEffect from "../../../../shared/utils/use-sized-canvas-effect";
import { GamePaletteWithColors, PatternTile } from "../../store";
import drawTile from "../../draw-tile";

const PIXEL_ROWS_PER_TILE = 8;
const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;

type Props = {
  scale: number; // in range [1, ...]
  tile: PatternTile;
  palette: GamePaletteWithColors;
  ["aria-label"]: string;
};

const Tile = ({ scale, tile, palette, ...rest }: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useSizedCanvasEffect(
    canvasRef,
    PIXEL_COLUMNS_PER_TILE,
    PIXEL_ROWS_PER_TILE,
    scale
  );

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    drawTile(ctx, 0, 0, 0, 0, tile.pixels, palette.colors, scale);
  }, [tile, palette, scale]);

  return <canvas {...rest} ref={canvasRef} role="img" />;
};

export default Tile;
