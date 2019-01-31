import React from "react";
import styles from "./Container.module.scss";

type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);

export default Container;
