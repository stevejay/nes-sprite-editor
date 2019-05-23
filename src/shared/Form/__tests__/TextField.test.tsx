import React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import { TextField } from "..";

afterEach(cleanup);

const TextFieldWithState = () => {
  const [value, setValue] = React.useState("initial value");
  return (
    <TextField
      label="The label:"
      value={value}
      onChange={(event: React.ChangeEvent<any>) => setValue(event.target.value)}
    />
  );
};

test("displays correctly initially", async () => {
  const { getByLabelText } = render(<TextFieldWithState />);
  const input = getByLabelText("The label:") as HTMLInputElement;
  expect(input).toBeTruthy();
  expect(input.value).toEqual("initial value");
});

test("updates when the user types into it", async () => {
  const { getByLabelText } = render(<TextFieldWithState />);
  const input = getByLabelText("The label:") as HTMLInputElement;
  userEvent.type(input, "ABC");
  expect(input.value).toEqual("ABC");
});
