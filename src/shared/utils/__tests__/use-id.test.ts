import { renderHook } from "@testing-library/react-hooks";
import useId from "../use-id";

test("creates a stable id", () => {
  const { result, rerender } = renderHook(() => useId());
  expect(result.current).toEqual(expect.stringMatching(/^id_[0-9]+$/));
  const lastId = result.current;
  rerender();
  expect(result.current).toEqual(lastId);
});

test("creates a stable id with a custom prefix", () => {
  const { result, rerender } = renderHook(() => useId("custom-prefix_"));
  expect(result.current).toEqual(
    expect.stringMatching(/^custom-prefix_[0-9]+$/)
  );
  const lastId = result.current;
  rerender();
  expect(result.current).toEqual(lastId);
});
