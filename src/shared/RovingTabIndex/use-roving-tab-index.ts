import React from "react";
import { RovingTabIndexContext } from "./Provider";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

type ReturnType = [
  number,
  (event: React.KeyboardEvent<any>) => void,
  () => void,
  boolean
];

export default function useRovingTabIndex(index: number): ReturnType {
  if (!isFinite(index) || index < 0) {
    throw new Error("useRovingTabIndex: index must be integer >= 0");
  }

  const context = React.useContext(RovingTabIndexContext);
  const selected = index === context.state.selectedIndex;

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<any>) => {
      if (event.keyCode === ARROW_LEFT) {
        context.tabPrev();
      } else if (event.keyCode === ARROW_RIGHT) {
        context.tabNext();
      }
    },
    [context]
  );

  const handleClick = React.useCallback(() => context.clicked(index), [
    context
  ]);

  const tabIndex = selected ? 0 : -1;
  const focused = selected && context.state.lastActionOrigin === "keyboard";
  return [tabIndex, handleKeyDown, handleClick, focused];
}
