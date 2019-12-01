import { renderHook, act } from "@testing-library/react-hooks";
import useVersion from "../use-version";

test("incrementing the version", () => {
  const { result } = renderHook(() => useVersion());

  expect(result.current[0]).toBeGreaterThanOrEqual(0);
  const lastVersion = result.current[0];

  act(() => {
    result.current[1]();
  });

  expect(result.current[0]).toEqual(lastVersion + 1);
});
