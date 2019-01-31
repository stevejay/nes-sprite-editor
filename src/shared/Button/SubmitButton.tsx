import React from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

type Props = {
  label: string;
  tabIndex?: number;
  disabled?: boolean;
  ariaLabel?: string;
  size?: "small" | "medium";
  color?: "default" | "primary" | "transparent";
  className?: string;
};

const SubmitButton = ({
  label,
  tabIndex = 0,
  disabled = false,
  ariaLabel,
  size = "medium",
  color = "default",
  className
}: Props) => {
  const buttonClassNames = classNames(
    styles.button,
    styles[size],
    styles[color],
    className
  );

  return (
    <input
      type="submit"
      disabled={disabled}
      className={buttonClassNames}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      value={label}
    />
  );
};

export default SubmitButton;
