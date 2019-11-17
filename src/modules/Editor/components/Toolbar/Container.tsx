import React from "react";
import styles from "./Container.module.scss";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ className, children }: Props) => (
  <div className={`${styles.container} ${className || ""}`}>{children}</div>
);

export default Container;
