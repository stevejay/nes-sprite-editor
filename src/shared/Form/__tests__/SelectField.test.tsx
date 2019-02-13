import React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import { SelectField } from "..";

afterEach(cleanup);

const options = [
  { id: "1", label: "Some text 1" },
  { id: "2", label: "Some text 2" },
  { id: "3", label: "Some text 3" }
];

const SelectFieldWithState = () => {
  const [value, setValue] = React.useState("2");
  return (
    <SelectField<string>
      label="The label:"
      value={value}
      options={options}
      onChange={(value: string) => {
        console.log("value", value);
        setValue(value);
      }}
    />
  );
};

test("displays correctly initially", async () => {
  const { getByLabelText } = render(<SelectFieldWithState />);
  const input = getByLabelText("The label:") as HTMLInputElement;
  expect(input).toBeTruthy();
  expect(input.value).toEqual("2");
});
