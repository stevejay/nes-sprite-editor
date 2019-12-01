import React from "react";
import { noop } from "lodash";
import { render } from "@testing-library/react";
import TextInput from "../TextInput";

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
