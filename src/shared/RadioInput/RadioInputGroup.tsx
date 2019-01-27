import React from "react";
import { uniqueId } from "lodash";
import RadioInput from "./RadioInput";
import styles from "./RadioInputGroup.module.scss";

type Option = {
  id: string | number;
  label: string;
};

type Props = {
  legend: string;
  options: Array<Option>;
  selectedId: string | number;
  disabled?: boolean;
  inline?: boolean;
  renderLabel?: (option: Option) => React.ReactNode;
  onChange: (id: string | number) => void;
};

const RadioInputGroup: React.FunctionComponent<Props> = ({
  legend,
  options,
  selectedId,
  disabled,
  inline,
  renderLabel = (option: Option) => option.label,
  onChange
}) => {
  const labelId = React.useRef(uniqueId("radio-group_"));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <p id={labelId.current}>{legend}</p>
      <div
        role="radiogroup"
        className={styles.groupContainer}
        aria-labelledby={labelId.current}
      >
        {options.map(option => (
          <div
            key={option.id}
            className={inline ? styles.inlineInput : styles.blockInput}
          >
            <RadioInput
              value={option.id}
              groupName={labelId.current}
              checked={selectedId === option.id}
              disabled={disabled}
              onChange={handleChange}
            >
              {renderLabel(option)}
            </RadioInput>
          </div>
        ))}
      </div>
    </>
  );
};

export default RadioInputGroup;
