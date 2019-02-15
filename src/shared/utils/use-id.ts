import { uniqueId, isNil } from "lodash";
import React from "react";

export default function useId(prefix?: string): string {
  const id = React.useRef(uniqueId(isNil(prefix) ? "id_" : prefix));
  return id.current;
}
