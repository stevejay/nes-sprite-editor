import classNames from "classnames";
import { isEmpty, isNil } from "lodash";
import React from "react";
import styles from "./SelectInput.module.scss";

export type Option<IdT> = {
  id: IdT;
  label: string;
};

type Props<IdT> = {
  id?: string;
  options: Array<Option<IdT>>;
  value: IdT | null;
  name?: string;
  disabled?: boolean;
  onChange: (id: IdT) => void;
  className?: string;
};

const SelectInput = <P extends string | number>({
  id,
  name,
  options,
  value,
  disabled = false,
  onChange,
  className = ""
}: Props<P>) => {
  const showDisabled = disabled || isNil(value) || isEmpty(options);

  const containerClassNames = classNames(styles.container, className, {
    [styles.disabled]: showDisabled
  });

  return (
    <div className={containerClassNames}>
      <select
        id={id}
        name={name}
        value={value || undefined}
        onChange={event => onChange(event.target.value as P)}
        disabled={showDisabled}
        tabIndex={0}
      >
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
