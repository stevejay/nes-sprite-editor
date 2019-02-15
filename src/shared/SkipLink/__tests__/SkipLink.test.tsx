import React from "react";
import { render, cleanup } from "react-testing-library";
import SkipLink from "../SkipLink";

afterEach(cleanup);

test("displays correctly", async () => {
  const { container } = render(
    <SkipLink href="/some/href">The link text</SkipLink>
  );
  expect(container).toMatchSnapshot();
});
