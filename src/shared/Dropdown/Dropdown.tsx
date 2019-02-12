import classNames from "classnames";
import { isEmpty, isNil } from "lodash";
import React from "react";
import Downshift from "downshift";
import styles from "./Dropdown.module.scss";
import Button from "../Button";

type Option<IdT> = {
  id: IdT;
  label: string;
};

type Props<IdT> = {
  id?: string;
  label?: string;
  options: Array<Option<IdT>>;
  value: IdT | null;
  disabled?: boolean;
  onChange: (id: IdT) => void;
  className?: string;
};

const Dropdown = <P extends string | number>({
  id,
  label,
  options,
  value,
  disabled = false,
  onChange,
  className = ""
}: Props<P>) => (
  <Downshift
    onChange={selection => onChange(selection.id)}
    selectedItem={options.find(option => option.id === value)}
    itemToString={item => (item ? item.label : "")}
  >
    {({
      getItemProps,
      getLabelProps,
      getMenuProps,
      getToggleButtonProps,
      isOpen,
      // inputValue,
      highlightedIndex,
      selectedItem
    }) => (
      <div className={styles.container}>
        {label && <label {...getLabelProps()}>{label}</label>}
        <Button
          className={styles.toggleButton}
          appearance="input"
          {...getToggleButtonProps()}
        >
          {selectedItem.label}
        </Button>
        <ul
          className={`${styles.menu} ${isOpen ? styles.open : ""}`}
          {...getMenuProps()}
        >
          {isOpen
            ? options.map((option, index) => (
                <li
                  {...getItemProps({
                    key: option.id,
                    index,
                    item: option,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? "lightgray" : "white",
                      fontWeight: selectedItem === option ? "bold" : "normal"
                    }
                  })}
                >
                  {option.label}
                </li>
              ))
            : null}
        </ul>
      </div>
    )}
  </Downshift>
);

export default Dropdown;
