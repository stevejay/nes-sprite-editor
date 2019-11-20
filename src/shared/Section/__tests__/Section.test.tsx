import React from "react";
import { render } from "@testing-library/react";
import Section from "../Section";

test("displays correctly", async () => {
  const { container } = render(<Section>content</Section>);
  expect(container).toMatchSnapshot();
});
