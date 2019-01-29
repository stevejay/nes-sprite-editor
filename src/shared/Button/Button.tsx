import React from "react";
import styles from "./Button.module.scss";
import { IconType } from "react-icons/lib/iconBase";
import classNames from "classnames";

type Props = {
  type?: "button" | "submit";
  icon?: IconType;
  children?: React.ReactNode;
  tabIndex?: number;
  disabled?: boolean;
  ariaLabel?: string;
  size?: "small" | "medium";
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Button: React.FunctionComponent<Props> = ({
  type = "button",
  icon,
  children,
  tabIndex = 0,
  disabled = false,
  ariaLabel,
  size = "medium",
  className,
  onClick
}) => {
  const buttonClassNames = classNames(styles.button, styles[size], className);
  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassNames}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {icon && React.createElement(icon)}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
