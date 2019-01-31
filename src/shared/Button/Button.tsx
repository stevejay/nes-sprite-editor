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
  color?: "default" | "primary" | "transparent";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Button = ({
  type = "button",
  icon,
  children,
  tabIndex = 0,
  disabled = false,
  ariaLabel,
  size = "medium",
  color = "default",
  className,
  onClick
}: Props) => {
  const buttonClassNames = classNames(
    styles.button,
    styles[size],
    styles[color],
    className
  );

  if (type === "submit") {
    return (
      <input
        type="submit"
        disabled={disabled}
        className={buttonClassNames}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        value="Submit"
      />
    );
  }

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
