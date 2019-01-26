import React from "react";

export default function useSizedCanvasEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  rows: number,
  columns: number,
  scaling: number
) {
  const canvasSize = React.useMemo(
    () => ({
      width: columns * scaling,
      height: rows * scaling
    }),
    [scaling]
  );

  React.useLayoutEffect(
    () => {
      const canvas = canvasRef.current!;
      canvas.style.width = canvasSize.width + "px";
      canvas.style.height = canvasSize.height + "px";

      const scale = window.devicePixelRatio;
      canvas.width = canvasSize.width * scale;
      canvas.height = canvasSize.height * scale;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
    },
    [canvasSize]
  );

  return canvasSize;
}
