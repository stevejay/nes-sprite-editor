import { RefObject, useEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { useDebouncedState } from "./use-debounced-state";

type Dimensions = Pick<DOMRectReadOnly, "width" | "height">;
type Callback = (dimensions: Dimensions) => void;

const callbackLookup = new WeakMap<Element, Callback>();

const resizeObserverCallback: ResizeObserverCallback = entries => {
  for (const entry of entries) {
    const callback = callbackLookup.get(entry.target);

    if (callback) {
      callback({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height)
      });
    }
  }
};

const resizeObserver = new ResizeObserver(resizeObserverCallback);

function observe(element: Element, callback: Callback) {
  resizeObserver.observe(element);
  callbackLookup.set(element, callback);
}

function unobserve(element: Element) {
  resizeObserver.unobserve(element);
  callbackLookup.delete(element);
}

const useResizeObserver = (ref: RefObject<Element>, debounceMs: number = 0) => {
  const [dimensions, setDimensions] = useDebouncedState<Dimensions>(
    { width: 0, height: 0 },
    debounceMs
  );

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
  }, [ref, setDimensions]);

  return dimensions;
};

export { useResizeObserver };
