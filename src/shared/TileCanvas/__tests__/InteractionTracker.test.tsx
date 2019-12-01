import React from "react";
import { render, fireEvent } from "@testing-library/react";
import InteractionTracker from "../InteractionTracker";

const Child = () => (
  <div data-testid="child" style={{ width: 90, height: 180 }} />
);

function renderInteractionTracker(
  onSelect: (row: number, column: number, pressed: boolean) => void
) {
  return render(
    <InteractionTracker
      rows={3}
      columns={3}
      row={1}
      column={1}
      onSelect={onSelect}
    >
      <Child />
    </InteractionTracker>
  );
}

test("responds to arrow up", async () => {
  const handleSelect = jest.fn();
  const { getByTestId } = renderInteractionTracker(handleSelect);
  expect(handleSelect).not.toBeCalled();
  const child = getByTestId("child");
  fireEvent.keyDown(child, { key: "ArrowUp" });
  expect(handleSelect).toHaveBeenCalledWith(0, 1, false);
});

test("responds to arrow down", async () => {
  const handleSelect = jest.fn();
  const { getByTestId } = renderInteractionTracker(handleSelect);
  expect(handleSelect).not.toBeCalled();
  const child = getByTestId("child");
  fireEvent.keyDown(child, { key: "ArrowDown" });
  expect(handleSelect).toHaveBeenCalledWith(2, 1, false);
});

test("responds to arrow left", async () => {
  const handleSelect = jest.fn();
  const { getByTestId } = renderInteractionTracker(handleSelect);
  expect(handleSelect).not.toBeCalled();
  const child = getByTestId("child");
  fireEvent.keyDown(child, { key: "ArrowLeft" });
  expect(handleSelect).toHaveBeenCalledWith(1, 0, false);
});

test("responds to arrow right", async () => {
  const handleSelect = jest.fn();
  const { getByTestId } = renderInteractionTracker(handleSelect);
  expect(handleSelect).not.toBeCalled();
  const child = getByTestId("child");
  fireEvent.keyDown(child, { key: "ArrowRight" });
  expect(handleSelect).toHaveBeenCalledWith(1, 2, false);
});

test("responds to enter", async () => {
  const handleSelect = jest.fn();
  const { getByTestId } = renderInteractionTracker(handleSelect);
  expect(handleSelect).not.toBeCalled();
  const child = getByTestId("child");
  fireEvent.keyDown(child, { key: "Enter" });
  expect(handleSelect).toHaveBeenCalledWith(1, 1, true);
});

test("responds to click", async () => {
  const handleSelect = jest.fn();
  const { getByTestId, container } = renderInteractionTracker(handleSelect);
  expect(handleSelect).not.toBeCalled();
  // have to mock bounding client rect for jsdom:
  const trackerElement = container.children[0];
  trackerElement.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 90,
    bottom: 180,
    width: 90,
    height: 180
  });
  const child = getByTestId("child");
  fireEvent.mouseDown(child, { clientX: 33, clientY: 170 });
  expect(handleSelect).toHaveBeenCalledWith(2, 1, true);
});
