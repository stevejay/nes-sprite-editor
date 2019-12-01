import React from "react";
import { render } from "@testing-library/react";
import Dropdown from "..";

const options = [
  { id: 0, label: "Some text label #0" },
  { id: 1, label: "Some text label #1" }
];

const DropdownWithState = () => {
  const [value, setValue] = React.useState(1);
  return (
    <Dropdown<number>
      label="The label:"
      options={options}
      value={value}
      onChange={value => setValue(value)}
    />
  );
};

test("displays correctly initially", async () => {
  const { getByLabelText, getByRole } = render(<DropdownWithState />);

  const container = getByRole("combobox");
  expect(container).toBeTruthy();
  expect(container.getAttribute("aria-expanded")).toEqual("false");

  const button = getByLabelText("The label:");
  expect(button).toBeTruthy();
  expect(button.textContent).toEqual("Some text label #1");

  const listbox = getByRole("listbox");
  expect(listbox.children.length).toEqual(0);
});

test("displays correctly when opened", async () => {
  const { getByLabelText, getByRole, getAllByRole, container } = render(
    <DropdownWithState />
  );

  const button = getByLabelText("The label:");
  button.click();

  const combobox = getByRole("combobox");
  expect(combobox.getAttribute("aria-expanded")).toEqual("true");

  const options = getAllByRole("option");
  expect(options).toHaveLength(2);
  expect(options[0].getAttribute("aria-selected")).toEqual("false");
  expect(options[1].getAttribute("aria-selected")).toEqual("true");
});

test("updates when option selected", async () => {
  const { getByLabelText, getAllByRole } = render(<DropdownWithState />);

  let button = getByLabelText("The label:");
  button.click();

  const options = getAllByRole("option");
  options[0].click();

  button = getByLabelText("The label:");
  expect(button.textContent).toEqual("Some text label #0");
});
