import React from "react";
import styles from "./TextInput.module.scss";

export type Props = {
  type?: "text";
  value: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange: (value: string) => void;
};

const TextInput: React.FunctionComponent<Props> = ({
  type = "text",
  value,
  disabled = false,
  id,
  name,
  onChange
}) => (
  <input
    id={id}
    name={name}
    className={styles.input}
    type={type}
    value={value}
    disabled={disabled}
    onChange={event => onChange(event.target.value)}
    autoCapitalize="off"
    autoComplete="off"
    autoCorrect="off"
    spellCheck={false}
  />
);

export default TextInput;
