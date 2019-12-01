import React, { useRef } from "react";
import { useResizeObserver } from "../use-resize-observer";

const ObservedContainer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(ref);

  return (
    <>
      <p>
        Width: {width}px, Height: {height}px
      </p>
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "papayawhip"
        }}
      >
        <p>Hello, you</p>
      </div>
    </>
  );
};
