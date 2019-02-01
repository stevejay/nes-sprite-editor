import React from "react";
import styles from "./TextInput.module.scss";

export type Props = {
  type?: "text";
  value: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  autosOff?: boolean;
  onChange: (value: string) => void;
};

const TextInput = ({
  type = "text",
  value,
  disabled = false,
  id,
  name,
  autosOff,
  onChange
}: Props) => (
  <input
    id={id}
    name={name}
    className={styles.input}
    type={type}
    value={value}
    disabled={disabled}
    onChange={event => onChange(event.target.value)}
    autoCapitalize={autosOff ? "off" : undefined}
    autoComplete={autosOff ? "off" : undefined}
    autoCorrect={autosOff ? "off" : undefined}
    spellCheck={autosOff ? false : undefined}
  />
);

export default TextInput;
