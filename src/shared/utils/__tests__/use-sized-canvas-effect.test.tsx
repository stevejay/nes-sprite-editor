import React from "react";
import { renderHook } from "react-hooks-testing-library";
import useSizedCanvasEffect from "../use-sized-canvas-effect";
import { createCanvas } from "canvas";

test("sizes a canvas", () => {
  const canvas = createCanvas(200, 200);

  renderHook(() => {
    const canvasRef = React.useRef<HTMLCanvasElement>(canvas);
    useSizedCanvasEffect(canvasRef, 5, 20, 2);
  });

  expect(canvas.width).toEqual(10);
  expect(canvas.height).toEqual(40);
});
