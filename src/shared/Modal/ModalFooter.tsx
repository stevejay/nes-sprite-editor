import React from "react";
import styles from "./ModalFooter.module.scss";

type Props = {
  children: React.ReactNode;
};

const ModalFooter: React.FunctionComponent<Props> = ({ children }) => (
  <div className={styles.footer}>{children}</div>
);

export default ModalFooter;
