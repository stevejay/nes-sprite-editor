import React from "react";

export default function useAriaHidden(shouldUse: boolean, id: string = "root") {
  React.useEffect(
    () => {
      if (!shouldUse) {
        return;
      }
      const appRoot = document.getElementById(id);
      appRoot && appRoot.setAttribute("aria-hidden", "true");
      return () => {
        appRoot && appRoot.setAttribute("aria-hidden", "false");
      };
    },
    [shouldUse]
  );
}
