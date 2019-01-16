import React from "react";
import { uniqueId } from "lodash";
import styles from "./RadioInput.module.scss";

type Props = {
  value: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  groupName?: string;
  className?: string;
  disabled?: boolean;
};

const RadioInput: React.FunctionComponent<Props> = ({
  value,
  label,
  checked,
  onChange,
  groupName,
  className = "",
  disabled = false
}) => {
  const id = React.useRef(uniqueId("radio-input_"));
  return (
    <>
      <input
        type="radio"
        id={id.current}
        name={groupName}
        value={value}
        checked={checked}
        disabled={disabled}
        className={`screenreader-only ${styles.input} ${className}`}
        onChange={onChange}
      />
      <label htmlFor={id.current}>{label}</label>
    </>
  );
};

export default RadioInput;
