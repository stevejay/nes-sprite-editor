import { RefObject, useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

type Callback = (dimensions: Pick<DOMRectReadOnly, "width" | "height">) => void;

const callbackLookup = new WeakMap<Element, Callback>();

const resizeObserverCallback: ResizeObserverCallback = entries => {
  for (const entry of entries) {
    const callback = callbackLookup.get(entry.target);

    if (callback) {
      callback(entry.contentRect);
    }
  }
};

const resizeObserver = new ResizeObserver(resizeObserverCallback);

function observe(element: Element, callback: Callback) {
  resizeObserver.observe(element);
  callbackLookup.set(element, callback);
}

function unobserve(element) {
  resizeObserver.unobserve(element);
  callbackLookup.delete(element);
}

const useResizeObserver = (ref: RefObject<Element>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const element = ref.current;

    observe(element, newDimensions => {
      setDimensions(existingDimensions =>
        newDimensions.width !== existingDimensions.width ||
        newDimensions.height !== existingDimensions.height
          ? newDimensions
          : existingDimensions
      );
    });

    return () => {
      unobserve(element);
    };
  }, [ref, ref.current, setDimensions]);

  return dimensions;
};

export { useResizeObserver };
