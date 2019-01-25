import React from "react";

// Invokes focus() on ref as a layout effect whenever focused is true.
export default function useFocusEffect(
  focused: boolean | null | undefined,
  ref: React.RefObject<any>
) {
  React.useLayoutEffect(
    () => {
      if (focused) {
        ref.current!.focus();
      }
    },
    [focused]
  );
}