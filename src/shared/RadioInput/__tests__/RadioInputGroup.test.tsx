import React from "react";
import { render } from "@testing-library/react";
import { noop } from "lodash";
import userEvent from "@testing-library/user-event";
import RadioInput from "..";

const options = [
  { id: 1, label: "First option" },
  { id: 2, label: "Second option" }
];

test("displays correctly", async () => {
  const { container } = render(
    <RadioInput.Group
      legend="The Radio Group Legend:"
      options={options}
      selectedId={2}
      onChange={noop}
    />
  );
  expect(container).toMatchSnapshot();
});

test("has correct a11y markup", async () => {
  const { getByRole, getByLabelText } = render(
    <RadioInput.Group
      legend="The Radio Group Legend:"
      options={options}
      selectedId={2}
      onChange={noop}
    />
  );

  const radioGroup = getByRole("radiogroup");
  expect(radioGroup).toBeTruthy();

  const radioGroupByLegend = getByLabelText("The Radio Group Legend:");
  expect(radioGroupByLegend).toBeTruthy();
  expect(radioGroupByLegend).toEqual(radioGroup);

  const radioInputOne = getByLabelText("First option");
  expect(radioInputOne).toBeTruthy();

  const radioInputTwo = getByLabelText("Second option");
  expect(radioInputTwo).toBeTruthy();
});

test("change selected input from second to first", async () => {
  const handleChange = jest.fn();
  const { getByLabelText } = render(
    <RadioInput.Group
      legend="The Radio Group Legend:"
      options={options}
      selectedId={2}
      onChange={handleChange}
    />
  );

  userEvent.click(getByLabelText("First option"));
  expect(handleChange).toHaveBeenCalledWith(1);
});
