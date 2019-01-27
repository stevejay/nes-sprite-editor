import React from "react";
import { uniqueId } from "lodash";
import RadioInput from "./RadioInput";
import styles from "./RadioInputGroup.module.scss";

type Option<IdT> = {
  id: IdT;
  label: string;
};

type Props<IdT> = {
  legend: string;
  options: Array<Option<IdT>>;
  selectedId: IdT;
  disabled?: boolean;
  inline?: boolean;
  renderLabel?: (option: Option<IdT>) => React.ReactNode;
  onChange: (id: IdT) => void;
};

const RadioInputGroup = <P extends string | number>({
  legend,
  options,
  selectedId,
  disabled,
  inline,
  renderLabel = option => option.label,
  onChange
}: Props<P>) => {
  const labelId = React.useRef(uniqueId("radio-group_"));
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
              onChange={() => onChange(option.id)}
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
