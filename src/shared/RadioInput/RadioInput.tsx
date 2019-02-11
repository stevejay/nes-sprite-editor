import React from "react";
import { uniqueId } from "lodash";
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

const RadioInput: React.FunctionComponent<Props> = ({
  value,
  children,
  checked,
  onChange,
  groupName,
  disabled = false
}) => {
  const id = useId();
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
