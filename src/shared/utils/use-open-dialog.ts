import React from "react";

export default function useOpenDialog(): [boolean, () => void, () => void] {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpen = React.useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return [isOpen, handleOpen, handleClose];
}
