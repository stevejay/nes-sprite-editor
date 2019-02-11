import { uniqueId } from "lodash";
import React from "react";

export default function useId(): string {
  const id = React.useRef(uniqueId("id_"));
  return id.current;
}
