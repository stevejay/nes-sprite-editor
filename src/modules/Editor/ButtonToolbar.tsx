import React from "react";
import styles from "./ButtonToolbar.module.scss";

type Props = {
  children: React.ReactNode;
};

const ButtonToolbar: React.FunctionComponent<Props> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

export default ButtonToolbar;
