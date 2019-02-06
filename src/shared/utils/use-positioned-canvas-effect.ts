import React from "react";

// Sets the top and left css properties of the canvas:
export default function usePositionedCanvasEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  xLogicalPx: number,
  yLogicalPx: number,
  scale: number
) {
  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    canvas.style.left = xLogicalPx * scale + "px";
    canvas.style.top = yLogicalPx * scale + "px";

    // console.log(
    //   `left/top=${xLogicalPx * scale + "px"}/${yLogicalPx * scale + "px"}`
    // );
  });
}
