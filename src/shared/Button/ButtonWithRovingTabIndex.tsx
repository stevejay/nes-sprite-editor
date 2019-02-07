import React from "react";
import Button, { Props as ButtonProps } from "./Button";
import { useRovingTabIndex } from "../RovingTabIndex";
import useFocusEffect from "../utils/use-focus-effect";

type Props = {
  type?: ButtonProps["type"];
  icon?: ButtonProps["icon"];
  children?: ButtonProps["children"];
  disabled?: ButtonProps["disabled"];
  ariaLabel?: ButtonProps["ariaLabel"];
  size?: ButtonProps["size"];
  color?: ButtonProps["color"];
  className?: ButtonProps["className"];
  onClick?: ButtonProps["onClick"];
  onKeyDown?: ButtonProps["onKeyDown"];
};

const ButtonWithRovingTabIndex = ({
  disabled = false,
  onClick: parentOnClick,
  onKeyDown: parentOnKeyDown,
  ...rest
}: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [tabIndex, focused, onKeyDown, onClick] = useRovingTabIndex(
    buttonRef,
    disabled
  );

  useFocusEffect(focused, buttonRef);

  return (
    <Button
      {...rest}
      ref={buttonRef}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={(event: React.MouseEvent<any>) => {
        parentOnClick && parentOnClick(event);
        onClick();
      }}
      onKeyDown={(event: React.KeyboardEvent<any>) => {
        parentOnKeyDown && parentOnKeyDown(event);
        onKeyDown(event);
      }}
    />
  );
};

export default ButtonWithRovingTabIndex;
