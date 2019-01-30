import React from "react";
import styles from "./ModalContent.module.scss";

type Props = {
  children: React.ReactNode;
};

const ModalContent: React.FunctionComponent<Props> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

export default ModalContent;
