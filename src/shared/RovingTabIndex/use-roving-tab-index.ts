import React from "react";
import { RovingTabIndexContext, ActionTypes } from "./Provider";
import { uniqueId } from "lodash";

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

type ReturnType = [
  number,
  boolean,
  (event: React.KeyboardEvent<any>) => void,
  () => void
];

// domElementRef:
//   - must remain stable for the lifetime of the component
//   - it must support focus() being invoked on it
export default function useRovingTabIndex(
  domElementRef: React.RefObject<any>,
  disabled: boolean
): ReturnType {
  // This id is stable for the life of the component:
  const id = React.useRef(uniqueId("roving-tab-index_"));
  const context = React.useContext(RovingTabIndexContext);

  // Registering and unregistering are tied to whether the input is disabled or not.
  // Context is not in the inputs because context.dispatch never changes.
  React.useLayoutEffect(() => {
    if (disabled) {
      return;
    }
    context.dispatch({
      type: ActionTypes.REGISTER,
      payload: { id: id.current, domElementRef }
    });
    return () => {
      context.dispatch({
        type: ActionTypes.UNREGISTER,
        payload: { id: id.current }
      });
    };
  }, [disabled]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<any>) => {
    if (event.keyCode === ARROW_LEFT) {
      context.dispatch({
        type: ActionTypes.TAB_TO_PREVIOUS,
        payload: { id: id.current }
      });
      event.preventDefault();
    } else if (event.keyCode === ARROW_RIGHT) {
      context.dispatch({
        type: ActionTypes.TAB_TO_NEXT,
        payload: { id: id.current }
      });
      event.preventDefault();
    }
  }, []);

  const handleClick = React.useCallback(() => {
    context.dispatch({
      type: ActionTypes.CLICKED,
      payload: { id: id.current }
    });
  }, []);

  const selected = !disabled && id.current === context.state.selectedId;
  const tabIndex = selected ? 0 : -1;
  const focused = selected && context.state.lastActionOrigin === "keyboard";
  return [tabIndex, focused, handleKeyDown, handleClick];
}
