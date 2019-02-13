import React from "react";
import styles from "./FieldContainer.module.scss";

type Props = {
  children: React.ReactNode;
};

const FieldContainer = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);

export default FieldContainer;
