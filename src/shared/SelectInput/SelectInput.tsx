import React from "react";
import styles from "./SelectInput.module.scss";
import { isEmpty, isNil } from "lodash";
import classNames from "classnames";

type Option<IdT> = {
  id: IdT;
  label: string;
};

type Props<IdT> = {
  id?: string;
  options: Array<Option<IdT>>;
  value: IdT | null;
  disabled?: boolean;
  onChange: (id: IdT) => void;
  className?: string;
};

const SelectInput = <P extends string | number>({
  id,
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
