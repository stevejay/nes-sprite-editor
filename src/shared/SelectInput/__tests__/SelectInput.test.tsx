import React from "react";
import { render } from "@testing-library/react";
import SelectInput from "../SelectInput";
import { noop } from "lodash";

const options = [
  { id: 1, label: "Some text 1" },
  { id: 2, label: "Some text 2" },
  { id: 3, label: "Some text 3" }
];

test("displays correctly", async () => {
  const { container } = render(
    <SelectInput
      id="the-id"
      name="the-name"
      options={options}
      value={2}
      disabled={false}
      onChange={noop}
    />
  );
  expect(container).toMatchSnapshot();
});
