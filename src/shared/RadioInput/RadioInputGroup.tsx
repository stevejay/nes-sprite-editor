import React from "react";
import { uniqueId } from "lodash";
import RadioInput from "./RadioInput";
import styles from "./RadioInputGroup.module.scss";

type Props = {
  legend: string;
  options: Array<{ id: string; label: string }>;
  selectedId: string;
  disabled?: boolean;
  inline?: boolean;
  onChange: (id: string) => void;
};

const RadioInputGroup: React.FunctionComponent<Props> = ({
  legend,
  options,
  selectedId,
  disabled,
  inline,
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
        className={styles.radioGroup}
        aria-labelledby={labelId.current}
      >
        {options.map(option => (
          <div
            key={option.id}
            className={inline ? styles.inlineGroup : styles.blockGroup}
          >
            <RadioInput
              value={option.id}
              label={option.label}
              groupName={labelId.current}
              checked={selectedId === option.id}
              disabled={disabled}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default RadioInputGroup;
