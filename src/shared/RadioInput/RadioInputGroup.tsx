import React from "react";
import { uniqueId } from "lodash";
import RadioInput from "./RadioInput";
import styles from "./RadioInputGroup.module.scss";
import useId from "../utils/use-id";

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
  const labelId = useId();
  return (
    <>
      <p className={styles.label} id={labelId}>
        {legend}
      </p>
      <div
        role="radiogroup"
        className={styles.groupContainer}
        aria-labelledby={labelId}
      >
        {options.map(option => (
          <div
            key={option.id}
            className={inline ? styles.inlineInput : styles.blockInput}
          >
            <RadioInput
              value={option.id}
              groupName={labelId}
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
