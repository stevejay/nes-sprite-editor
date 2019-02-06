import React from "react";

// Sizes the specified canvas, taking into account device pixel ratio.
export default function useSizedCanvasEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  widthLogicalPx: number,
  heightLogicalPx: number,
  scale: number
) {
  const canvasSize = React.useMemo(
    () => ({
      width: widthLogicalPx * scale,
      height: heightLogicalPx * scale
    }),
    [widthLogicalPx, heightLogicalPx, scale]
  );

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    canvas.style.width = canvasSize.width + "px";
    canvas.style.height = canvasSize.height + "px";

    const deviceScale = window.devicePixelRatio;
    canvas.width = canvasSize.width * deviceScale;
    canvas.height = canvasSize.height * deviceScale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(deviceScale, deviceScale);
  }, [canvasSize]);

  return canvasSize;
}
