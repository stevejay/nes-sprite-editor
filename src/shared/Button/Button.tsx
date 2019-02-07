import React from "react";
import styles from "./Button.module.scss";
import { IconType } from "react-icons/lib/iconBase";
import classNames from "classnames";

export type Props = {
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
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      type = "button",
      icon,
      children,
      tabIndex = 0,
      disabled = false,
      ariaLabel,
      size = "medium",
      color = "default",
      className,
      onClick,
      onKeyDown
    }: Props,
    ref
  ) => {
    const buttonClassNames = classNames(
      styles.button,
      styles[size],
      styles[color],
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={buttonClassNames}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {icon && React.createElement(icon)}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

export default Button;
