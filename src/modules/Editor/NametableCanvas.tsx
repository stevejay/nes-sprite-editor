import React from "react";
import usePositionedCanvasEffect from "../../shared/utils/use-positioned-canvas-effect";
import useSizedCanvasEffect from "../../shared/utils/use-sized-canvas-effect";
import { GamePaletteWithColors, Nametable, PatternTile } from "./store";
import { RenderCanvasPositioning, ViewportSize } from "./experiment";
import styles from "./NametableCanvas.module.scss";
import useDrawNametableEffect from "./use-draw-nametable-effect";

type Props = {
  viewportSize: ViewportSize;
  renderCanvasPositioning: RenderCanvasPositioning;
  nametable: Nametable;
  patternTiles: Array<PatternTile>;
  palettes: Array<GamePaletteWithColors>;
  ["aria-label"]: string;
  // react-draggable:
  style?: any; // TODO fix any
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void; // TODO fix any
  onMouseUp?: any; // TODO fix any
  onTouchStart?: any; // TODO fix any
  onTouchEnd?: any; // TODO fix any
};

const NametableCanvas = ({
  renderCanvasPositioning,
  nametable,
  patternTiles,
  palettes,
  // react-draggable:
  style,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  ...rest
}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useSizedCanvasEffect(
    canvasRef,
    renderCanvasPositioning.size.widthLogicalPx,
    renderCanvasPositioning.size.heightLogicalPx,
    renderCanvasPositioning.scale
  );

  usePositionedCanvasEffect(
    canvasRef,
    renderCanvasPositioning.viewportOffset.xLogicalPx,
    renderCanvasPositioning.viewportOffset.yLogicalPx,
    renderCanvasPositioning.scale
  );

  useDrawNametableEffect(
    canvasRef,
    nametable,
    patternTiles,
    palettes,
    renderCanvasPositioning
  );

  return (
    <canvas
      {...rest}
      ref={canvasRef}
      className={styles.canvas}
      style={style}
      role="img"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
  );
};

export default NametableCanvas;
