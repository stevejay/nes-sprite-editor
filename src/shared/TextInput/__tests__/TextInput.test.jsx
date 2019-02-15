import React from "react";
import { noop } from "lodash";
import { render, cleanup } from "react-testing-library";
import TextInput from "../TextInput";

afterEach(cleanup);

test("displays correctly", async () => {
  const { container } = render(
    <TextInput
      value="the value"
      id="the-id"
      name="the-name"
      autosOff
      onChange={noop}
    />
  );
  expect(container).toMatchSnapshot();
});
