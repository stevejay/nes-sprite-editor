import React from "react";
import { render, cleanup } from "react-testing-library";
import Section from "../Section";

afterEach(cleanup);

test("displays correctly", async () => {
  const { container } = render(<Section>content</Section>);
  expect(container).toMatchSnapshot();
});
