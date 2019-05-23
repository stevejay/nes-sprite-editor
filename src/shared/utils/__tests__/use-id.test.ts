import { renderHook } from "react-hooks-testing-library";

import useId from "../use-id";

test("creates a stable id", () => {
  let id = null;
  const { rerender } = renderHook(() => (id = useId()));
  expect(id).toEqual(expect.stringMatching(/^id_[0-9]+$/));
  const lastId = id;
  rerender();
  expect(id).toEqual(lastId);
});

test("creates a stable id with a custom prefix", () => {
  let id = null;
  const { rerender } = renderHook(() => (id = useId("custom-prefix_")));
  expect(id).toEqual(expect.stringMatching(/^custom-prefix_[0-9]+$/));
  const lastId = id;
  rerender();
  expect(id).toEqual(lastId);
});
