import React from "react";
import { render, cleanup } from "react-testing-library";
import ModalHeader from "../ModalHeader";
import userEvent from "user-event";
import { noop } from "lodash";

afterEach(cleanup);

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
