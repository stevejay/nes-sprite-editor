import React from "react";
import styles from "./Panel.module.scss";

type Props = {
  ["aria-label"]?: string;
  ["aria-orientation"]?: "horizontal" | "vertical" | undefined;
  role?: string;
  className?: string;
  children: React.ReactNode;
};

const Panel: React.FunctionComponent<Props> = ({
  role,
  className = "",
  children,
  ...rest
}) => (
  <div {...rest} role={role} className={`${styles.container} ${className}`}>
    {children}
  </div>
);

export default Panel;
