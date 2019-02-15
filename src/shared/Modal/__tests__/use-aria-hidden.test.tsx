import React from "react";
import { render, cleanup } from "react-testing-library";
import useAriaHidden from "../use-aria-hidden";

afterEach(cleanup);

const Wrapper = ({ active }: { active: boolean }) => {
  useAriaHidden(active, "wrapper");
  return (
    <div id="wrapper" data-testid="wrapper">
      content
    </div>
  );
};

test("not active", () => {
  const { getByTestId } = render(<Wrapper active={false} />);
  expect(getByTestId("wrapper").getAttribute("aria-hidden")).toEqual(null);
});

test("active", () => {
  const { getByTestId } = render(<Wrapper active />);
  expect(getByTestId("wrapper").getAttribute("aria-hidden")).toEqual("true");
});

test("toggling from active to not active", () => {
  const { getByTestId, rerender } = render(<Wrapper active />);
  rerender(<Wrapper active={false} />);
  expect(getByTestId("wrapper").getAttribute("aria-hidden")).toEqual("false");
});
