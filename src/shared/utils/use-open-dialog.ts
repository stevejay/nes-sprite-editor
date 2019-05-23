import React from "react";

// The returned callbacks handleOpen and handleClose are stable.
export default function useOpenDialog(): [boolean, () => void, () => void] {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpen = React.useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return [isOpen, handleOpen, handleClose];
}
