import React from "react";
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
  const groupId = useId("radio-group_");
  return (
    <>
      <p className={styles.label} id={groupId}>
        {legend}
      </p>
      <div
        role="radiogroup"
        className={styles.groupContainer}
        aria-labelledby={groupId}
      >
        {options.map(option => (
          <div
            key={option.id}
            className={
              inline
                ? styles.inlineInputsContainer
                : styles.blockInputsContainer
            }
          >
            <RadioInput
              value={option.id}
              groupName={groupId}
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
