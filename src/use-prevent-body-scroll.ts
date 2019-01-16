import React from "react";

export default function usePreventBodyScroll(shouldUse: boolean) {
  React.useEffect(
    () => {
      if (!shouldUse) {
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
    [shouldUse]
  );
}
