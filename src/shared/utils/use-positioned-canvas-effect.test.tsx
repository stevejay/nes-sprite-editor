import React from "react";
import { render, cleanup } from "react-testing-library";
import usePositionedCanvasEffect from "./use-positioned-canvas-effect";

const Wrapper = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const id = usePositionedCanvasEffect(canvasRef, 10, 20, 2);
  return <canvas ref={canvasRef} data-testid="canvas" />;
};

afterEach(cleanup);

test("use-id", () => {
  const { getByTestId, rerender } = render(<Wrapper />);
  // let div = getByTestId("canvas");
  // expect(div.id).toEqual(expect.stringMatching(/^id_[0-9]+$/));
  // const id = div.id;
  // rerender(<Wrapper />);
  // div = getByTestId("canvas");
  // expect(div.id).toEqual(id);
});
