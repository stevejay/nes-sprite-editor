import React from "react";
import { render } from "@testing-library/react";
import SkipLink from "../SkipLink";

test("displays correctly", async () => {
  const { container } = render(
    <SkipLink href="/some/href">The link text</SkipLink>
  );
  expect(container).toMatchSnapshot();
});
