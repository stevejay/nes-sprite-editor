import React, { FC, useRef, useState } from "react";
import { useResizeObserver } from "../use-resize-observer";

const ObservedContainer: FC<{
  boxWidth: string;
  boxHeight: string;
  color: string;
}> = ({ boxWidth, boxHeight, color }) => {
  const [debounceMs, setDebounceMs] = useState(250);
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(ref, debounceMs);

  console.log("RENDERING");

  return (
    <>
      <label>
        Debounce:{" "}
        <input
          value={debounceMs}
          onChange={event =>
            setDebounceMs(parseInt(event.target.value || "0", 10))
          }
        />
      </label>
      <p>
        Width: {width}px, Height: {height}px
      </p>
      <div
        ref={ref}
        style={{
          width: boxWidth,
          height: boxHeight,
          minWidth: 180,
          minHeight: 100,
          overflow: "visible"
        }}
      >
        {width > 0 && height > 0 && (
          <p style={{ width, height, backgroundColor: color }}>Hello, you</p>
        )}
      </div>
    </>
  );
};

export default { title: "ResizeObserver" };

export const withObservedContainer = () => (
  <>
    <ObservedContainer boxWidth="50vw" boxHeight="50vh" color="papayawhip" />
    {/* <ObservedContainer boxWidth="20vw" boxHeight="20vh" color="lavender" /> */}
  </>
);
