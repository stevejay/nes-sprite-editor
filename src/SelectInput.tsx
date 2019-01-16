import React from "react";
import styles from "./SelectInput.module.scss";

type Props = {
  options: Array<{ id: string; label: string }>;
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
};

const SelectInput: React.FunctionComponent<Props> = ({
  options,
  selectedId,
  onChange,
  className = ""
}) => (
  <div className={`${styles.container} ${className}`}>
    <select onChange={event => onChange(event.target.value)}>
      {options.map(option => (
        <option value={option.id} selected={selectedId === option.id}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput;
