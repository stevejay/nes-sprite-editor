import { renderHook, act } from "@testing-library/react-hooks";
import useOpenDialog from "../use-open-dialog";

test("can control opening and closing of a dialog", () => {
  const { result } = renderHook(() => useOpenDialog());
  expect(result.current[0]).toEqual(false);

  act(() => result.current[1]());
  expect(result.current[0]).toEqual(true);

  act(() => result.current[2]());
  expect(result.current[0]).toEqual(false);
});
