import React from "react";
import { render, cleanup } from "react-testing-library";
import useId from "./use-id";

const Wrapper = () => {
  const id = useId();
  return <div data-testid="wrapper" id={id} />;
};

afterEach(cleanup);

test("use-id", () => {
  const { getByTestId, rerender } = render(<Wrapper />);
  let div = getByTestId("wrapper");
  expect(div.id).toEqual(expect.stringMatching(/^id_[0-9]+$/));
  const id = div.id;
  // check the id persists between renders:
  rerender(<Wrapper />);
  div = getByTestId("wrapper");
  expect(div.id).toEqual(id);
});
