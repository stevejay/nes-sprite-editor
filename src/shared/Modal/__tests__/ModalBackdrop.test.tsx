import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalBackdrop from "../ModalBackdrop";

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
