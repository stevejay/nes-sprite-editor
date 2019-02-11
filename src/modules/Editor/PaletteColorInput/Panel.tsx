import React from "react";
import styles from "./Panel.module.scss";

type Props = {
  ariaLabel?: string;
  ariaOrientation?: "horizontal" | "vertical" | undefined;
  role?: string;
  className?: string;
  children: React.ReactNode;
};

const Panel: React.FunctionComponent<Props> = ({
  ariaLabel,
  ariaOrientation,
  role,
  className = "",
  children
}) => (
  <div
    aria-label={ariaLabel}
    aria-orientation={ariaOrientation}
    role={role}
    className={`${styles.container} ${className}`}
  >
    {children}
  </div>
);

export default Panel;
