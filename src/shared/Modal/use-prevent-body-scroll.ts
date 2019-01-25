import React from "react";

export default function usePreventBodyScroll(isActive: boolean) {
  React.useEffect(
    () => {
      if (!isActive) {
        return;
      }

      const oldOverflow = document.body.style.overflow;
      if (oldOverflow === "hidden") {
        return;
      }

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = oldOverflow;
      };
    },
    [isActive]
  );
}
