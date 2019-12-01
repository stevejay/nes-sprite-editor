import React from "react";
import { render } from "@testing-library/react";
import ModalHeader from "../ModalHeader";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash";

test("displays correctly", async () => {
  const { container } = render(
    <ModalHeader onClose={noop}>content</ModalHeader>
  );
  expect(container).toMatchSnapshot();
});

test("close button reacts to mouse click", async () => {
  const handleClose = jest.fn();
  const { getByLabelText } = render(
    <ModalHeader onClose={handleClose}>content</ModalHeader>
  );
  const button = getByLabelText("Close the dialog");
  expect(button).toBeTruthy();
  userEvent.click(button);
  expect(handleClose).toHaveBeenCalledTimes(1);
});
