import { testHook, cleanup, act } from "react-testing-library";
import useVersion from "../use-version";

afterEach(cleanup);

test("incrementing the version", () => {
  let version = null;
  let incrementVersion: (() => void) | null = null;
  testHook(() => ([version, incrementVersion] = useVersion()));

  expect(version).toBeGreaterThanOrEqual(0);
  const lastVersion = version;

  act(() => incrementVersion!());
  expect(version).toEqual(lastVersion! + 1);
});
