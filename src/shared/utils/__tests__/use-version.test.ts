import { renderHook, act } from "react-hooks-testing-library";
import useVersion from "../use-version";

test("incrementing the version", () => {
  let version = null;
  let incrementVersion: (() => void) | null = null;
  renderHook(() => ([version, incrementVersion] = useVersion()));

  expect(version).toBeGreaterThanOrEqual(0);
  const lastVersion = version;

  act(() => incrementVersion!());
  expect(version).toEqual(lastVersion! + 1);
});
