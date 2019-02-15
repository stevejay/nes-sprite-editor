import React from "react";
import { render, cleanup } from "react-testing-library";
import usePreventBodyScroll from "../use-prevent-body-scroll";

afterEach(cleanup);

const Wrapper = ({ active }: { active: boolean }) => {
  usePreventBodyScroll(active);
  return <div />;
};

test("not active", () => {
  render(<Wrapper active={false} />);
  expect(document.body.style.overflow).toEqual("");
});

test("active", () => {
  render(<Wrapper active />);
  expect(document.body.style.overflow).toEqual("hidden");
});

test("toggling from active to not active", () => {
  const { rerender } = render(<Wrapper active />);
  rerender(<Wrapper active={false} />);
  expect(document.body.style.overflow).toEqual("");
});
