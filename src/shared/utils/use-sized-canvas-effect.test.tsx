import React from "react";
import { render, cleanup } from "react-testing-library";
import useSizedCanvasEffect from "./use-sized-canvas-effect";

const Wrapper = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  useSizedCanvasEffect(canvasRef, 5, 20, 2);
  return <canvas ref={canvasRef} data-testid="canvas" />;
};

afterEach(cleanup);

test("sizes a canvas", () => {
  const { getByTestId } = render(<Wrapper />);
  const canvas = getByTestId("canvas");
  expect(canvas.style.left).toEqual("10px");
  expect(canvas.style.top).toEqual("40px");
});
