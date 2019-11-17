import React from "react";
import styles from "./Toolbar.module.scss";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Toolbar = ({ className, children }: Props) => (
  <div className={`${styles.toolbar} ${className || ""}`}>{children}</div>
);

export default Toolbar;
