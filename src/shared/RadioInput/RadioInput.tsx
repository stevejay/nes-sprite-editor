import React from "react";
import styles from "./RadioInput.module.scss";
import useId from "../utils/use-id";

type Props = {
  value: string | number;
  children: React.ReactNode;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  groupName?: string;
  disabled?: boolean;
};

const RadioInput = ({
  value,
  children,
  checked,
  onChange,
  groupName,
  disabled = false
}: Props) => {
  const id = useId("radio-input_");
  return (
    <>
      <input
        type="radio"
        id={id}
        name={groupName}
        value={value}
        checked={checked}
        disabled={disabled}
        className={styles.input}
        onChange={onChange}
      />
      <label htmlFor={id}>{children}</label>
    </>
  );
};

export default RadioInput;
