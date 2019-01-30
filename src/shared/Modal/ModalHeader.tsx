import React from "react";
import styles from "./ModalHeader.module.scss";
import { FiX } from "react-icons/fi";
import Button from "../Button";

type Props = {
  onClose?: () => void;
  children: React.ReactNode;
};

const ModalHeader: React.FunctionComponent<Props> = ({ onClose, children }) => (
  <header className={styles.header}>
    <h1>{children}</h1>
    {onClose && <Button icon={FiX} onClick={onClose} color="transparent" />}
  </header>
);

export default ModalHeader;
