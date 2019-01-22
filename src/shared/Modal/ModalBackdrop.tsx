import React from "react";
import styles from "./ModalBackdrop.module.scss";

type Props = {
  opacity: number;
  onClose?: () => void;
};

const ModalBackdrop: React.FunctionComponent<Props> = ({
  opacity,
  onClose
}) => {
  const eventHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onClose && onClose();
  };

  return (
    <div
      className={styles.backdrop}
      tabIndex={-1}
      style={{ opacity }}
      onMouseDown={onClose ? eventHandler : undefined}
      onTouchStart={onClose ? eventHandler : undefined}
    />
  );
};

export default React.memo(ModalBackdrop);
