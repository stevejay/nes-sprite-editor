import { testHook, cleanup } from "react-testing-library";
import useId from "../use-id";

afterEach(cleanup);

test("creates a stable id", () => {
  let id = null;
  const { rerender } = testHook(() => (id = useId()));
  expect(id).toEqual(expect.stringMatching(/^id_[0-9]+$/));
  const lastId = id;
  rerender();
  expect(id).toEqual(lastId);
});

test("creates a stable id with a custom prefix", () => {
  let id = null;
  const { rerender } = testHook(() => (id = useId("custom-prefix_")));
  expect(id).toEqual(expect.stringMatching(/^custom-prefix_[0-9]+$/));
  const lastId = id;
  rerender();
  expect(id).toEqual(lastId);
});
