import React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import ModalBackdrop from "../ModalBackdrop";

afterEach(cleanup);

test("displays correctly", async () => {
  const { container } = render(<ModalBackdrop opacity={0.5} />);
  expect(container).toMatchSnapshot();
});

test("reacts to mouse click", async () => {
  const handleClose = jest.fn();
  const { container } = render(
    <ModalBackdrop opacity={0.5} onClose={handleClose} />
  );
  userEvent.click(container.children[0]);
  expect(handleClose).toHaveBeenCalledTimes(1);
});
