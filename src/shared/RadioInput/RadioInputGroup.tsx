import React from "react";
import { uniqueId } from "lodash";
import RadioInput from "./RadioInput";
import styles from "./RadioInputGroup.module.scss";

type Props = {
  legend: string;
  options: Array<{ id: string; label: string }>;
  selectedId: string;
  onChange: (id: string) => void;
};

const RadioInputGroup: React.FunctionComponent<Props> = ({
  legend,
  options,
  selectedId,
  onChange
}) => {
  const labelId = React.useRef(uniqueId("radio-group-label_"));

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
          <React.Fragment key={option.id}>
            <RadioInput
              value={option.id}
              label={option.label}
              checked={selectedId === option.id}
              onChange={handleChange}
            />
            <br />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default RadioInputGroup;