import React from "react";
import styles from "./ModalHeader.module.scss";
import { FiX } from "react-icons/fi";
import Button from "../Button";

type Props = {
  onClose?: () => void;
  children: React.ReactNode;
};

const ModalHeader = ({ onClose, children }: Props) => (
  <header className={styles.header}>
    <h2>{children}</h2>
    {onClose && (
      <Button
        aria-label="Close the dialog"
        icon={FiX}
        onClick={onClose}
        appearance="transparent"
      />
    )}
  </header>
);

export default ModalHeader;
