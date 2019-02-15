import React from "react";
import { testHook, cleanup } from "react-testing-library";
import useSizedCanvasEffect from "../use-sized-canvas-effect";
import { createCanvas } from "canvas";

afterEach(cleanup);

test("sizes a canvas", () => {
  const canvas = createCanvas(200, 200);

  testHook(() => {
    const canvasRef = React.useRef<HTMLCanvasElement>(canvas);
    useSizedCanvasEffect(canvasRef, 5, 20, 2);
  });

  expect(canvas.width).toEqual(10);
  expect(canvas.height).toEqual(40);
});
