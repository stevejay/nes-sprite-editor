import React from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";
import { isNil } from "lodash";
import { IconType } from "react-icons/lib/cjs";

export type Props = {
  type?: "button" | "submit";
  role?: string;
  icon?: IconType;
  children?: React.ReactNode;
  tabIndex?: number;
  disabled?: boolean;
  ["aria-label"]?: string;
  size?: "small" | "medium";
  appearance?: "default" | "dark" | "primary" | "input" | "transparent";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      type = "button",
      role,
      icon,
      children,
      tabIndex = 0,
      disabled = false,
      size = "medium",
      appearance = "default",
      className,
      onClick,
      onKeyDown,
      ...rest
    }: Props,
    ref
  ) => {
    const buttonClassNames = classNames(
      styles.button,
      styles[size],
      styles[appearance],
      className
    );

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        role={role}
        disabled={disabled}
        className={buttonClassNames}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {icon && React.createElement(icon)}
        {!isNil(children) && <span>{children}</span>}
      </button>
    );
  }
);

export default Button;
