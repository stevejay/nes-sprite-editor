import React, { useContext, useLayoutEffect } from "react";
import { RovingTabIndexContext } from "./Provider";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

export default function useRovingTabIndex(
  index: number,
  focusRef: React.RefObject<HTMLElement>
): [number, (event: React.KeyboardEvent<any>) => void, () => void] {
  const context = useContext(RovingTabIndexContext);
  const selected = index === context.state.selectedIndex;

  useLayoutEffect(
    () => {
      // set focus if:
      // - the associated node is selected
      // - the user used the keyboard to select it
      // - we have a valid ref
      if (
        selected &&
        context.state.lastActionOrigin === "keyboard" &&
        focusRef &&
        focusRef.current &&
        focusRef.current.focus
      ) {
        focusRef.current.focus();
      }
    },
    [selected]
  );

  const keyDownHandler = React.useCallback(
    (event: React.KeyboardEvent<any>) => {
      if (event.keyCode === ARROW_LEFT) {
        context.tabPrev();
      } else if (event.keyCode === ARROW_RIGHT) {
        context.tabNext();
      }
    },
    [context]
  );

  const onClickHandler = React.useCallback(() => context.clicked(index), [
    context
  ]);

  return [selected ? 0 : -1, keyDownHandler, onClickHandler];
}
