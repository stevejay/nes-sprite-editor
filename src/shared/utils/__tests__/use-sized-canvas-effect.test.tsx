import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useSizedCanvasEffect from "../use-sized-canvas-effect";
import { createCanvas } from "canvas";

test("sizes a canvas", () => {
  const canvas = createCanvas(200, 200);
  const canvasRef = React.useRef<HTMLCanvasElement>(canvas);

  renderHook(() => useSizedCanvasEffect(canvasRef, 5, 20, 2));

  expect(canvas.width).toEqual(10);
  expect(canvas.height).toEqual(40);
});
