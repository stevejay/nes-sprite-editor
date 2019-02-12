import { testHook, cleanup } from "react-testing-library";
import useId from "./use-id";

afterEach(cleanup);

test("use-id", () => {
  let id = null;
  const { rerender } = testHook(() => (id = useId()));
  expect(id).toEqual(expect.stringMatching(/^id_[0-9]+$/));
  const lastId = id;
  rerender();
  expect(id).toEqual(lastId);
});
