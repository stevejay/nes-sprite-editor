import React from "react";
import styles from "./ModalContent.module.scss";

type Props = {
  children: React.ReactNode;
};

const ModalContent = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);

export default ModalContent;
