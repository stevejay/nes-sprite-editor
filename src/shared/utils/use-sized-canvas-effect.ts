import React from "react";

// Sizes the specified canvas, taking into account device pixel ratio.
export default function useSizedCanvasEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  widthLogicalPx: number,
  heightLogicalPx: number,
  scale: number
) {
  React.useLayoutEffect(() => {
    const width = widthLogicalPx * scale;
    const height = heightLogicalPx * scale;

    const canvas = canvasRef.current!;

    // make conditional to support integration testing using node-canvas:
    if (canvas.style) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }

    const deviceScale = window.devicePixelRatio;
    canvas.width = width * deviceScale;
    canvas.height = height * deviceScale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(deviceScale, deviceScale);
  }, [widthLogicalPx, heightLogicalPx, scale, canvasRef]);
}
