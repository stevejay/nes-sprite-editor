import React from "react";

const ATTR_NAME = "aria-hidden";

export default function useAriaHidden(shouldUse: boolean, id: string = "root") {
  React.useEffect(
    () => {
      if (!shouldUse) {
        return;
      }

      const appRoot = document.getElementById(id);
      if (appRoot && appRoot.getAttribute(ATTR_NAME) === "true") {
        return;
      }

      appRoot && appRoot.setAttribute(ATTR_NAME, "true");
      return () => {
        appRoot && appRoot.setAttribute(ATTR_NAME, "false");
      };
    },
    [shouldUse]
  );
}
