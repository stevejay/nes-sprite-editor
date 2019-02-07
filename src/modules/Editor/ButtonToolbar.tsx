import React from "react";
import styles from "./ButtonToolbar.module.scss";

type Props = {
  children: React.ReactNode;
};

const ButtonToolbar = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);

export default ButtonToolbar;
