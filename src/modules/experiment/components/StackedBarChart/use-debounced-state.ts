import {
  useCallback,
  useState,
  useEffect,
  SetStateAction,
  Dispatch
} from "react";
import { debounce } from "lodash";

const useDebouncedState = <T>(
  initialState: T,
  debounceMs: number
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(initialState);

  const debouncedSetState = useCallback(debounce(setState, debounceMs), [
    setState,
    debounceMs
  ]);

  useEffect(() => {
    return () => {
      debouncedSetState.cancel();
    };
  }, [debouncedSetState]);

  return [state, debouncedSetState];
};

export { useDebouncedState };
