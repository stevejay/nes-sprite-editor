import { renderHook, act } from "react-hooks-testing-library";
import useOpenDialog from "../use-open-dialog";

test("can control opening and closing of a dialog", () => {
  let isOpen: boolean | null = null;
  let handleOpen: (() => void) | null = null;
  let handleClose: (() => void) | null = null;

  renderHook(() => ([isOpen, handleOpen, handleClose] = useOpenDialog()));
  expect(isOpen).toEqual(false);

  act(() => handleOpen!());
  expect(isOpen).toEqual(true);

  act(() => handleClose!());
  expect(isOpen).toEqual(false);
});
