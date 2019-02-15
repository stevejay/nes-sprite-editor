import React from "react";
import styles from "./Container.module.scss";

type Props = {
  ["aria-label"]?: string;
  ["aria-orientation"]?: "horizontal" | "vertical" | undefined;
  role?: string;
  className?: string;
  children: React.ReactNode;
};

const Container = ({ role, className = "", children, ...rest }: Props) => (
  <div {...rest} role={role} className={`${styles.container} ${className}`}>
    {children}
  </div>
);

export default Container;
