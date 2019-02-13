import React from "react";
import { render, cleanup } from "react-testing-library";
import usePositionedCanvasEffect from "./use-positioned-canvas-effect";

const Wrapper = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  usePositionedCanvasEffect(canvasRef, 5, 20, 2);
  return <canvas ref={canvasRef} data-testid="canvas" />;
};

afterEach(cleanup);

test("positions a canvas", () => {
  const { getByTestId } = render(<Wrapper />);
  const canvas = getByTestId("canvas");
  expect(canvas.style.left).toEqual("10px");
  expect(canvas.style.top).toEqual("40px");
});
