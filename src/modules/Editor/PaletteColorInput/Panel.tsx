import React from "react";
import styles from "./Panel.module.scss";

type Props = {
  ["aria-label"]?: string;
  ["aria-orientation"]?: "horizontal" | "vertical" | undefined;
  role?: string;
  className?: string;
  children: React.ReactNode;
};

const Panel = ({ role, className = "", children, ...rest }: Props) => (
  <div {...rest} role={role} className={`${styles.container} ${className}`}>
    {children}
  </div>
);

export default Panel;
