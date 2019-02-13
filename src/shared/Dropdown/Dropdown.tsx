import { Manager, Reference, Popper, PopperProps } from "react-popper";
import React from "react";
import Downshift from "downshift";
import styles from "./Dropdown.module.scss";
import Button from "../Button";
import classNames from "classnames";
import useId from "../utils/use-id";

type Option<IdT> = {
  id: IdT;
  label: string;
};

type Props<IdT> = {
  label?: string;
  options: Array<Option<IdT>>;
  value: IdT | null;
  disabled?: boolean;
  placement?: PopperProps["placement"];
  showScrollbar?: boolean;
  onChange: (id: IdT) => void;
  className?: string;
};

const Dropdown = <P extends string | number>({
  label,
  options,
  value,
  disabled = false,
  placement = "auto",
  showScrollbar = true,
  onChange
}: Props<P>) => {
  // need to apply htmlFor id on label to toggle button,
  // so have to manage this manually:
  const inputId = useId();
  return (
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
        highlightedIndex,
        selectedItem
      }) => (
        <div className={styles.container}>
          {label && (
            <label {...getLabelProps({ htmlFor: inputId })}>{label}</label>
          )}
          <Manager>
            <Reference>
              {({ ref }) => (
                <Button
                  id={inputId}
                  ref={ref}
                  className={styles.toggleButton}
                  appearance="input"
                  disabled={disabled}
                  {...getToggleButtonProps({})}
                >
                  {selectedItem.label}
                </Button>
              )}
            </Reference>
            <Popper placement={placement}>
              {({ ref, style, placement }) => {
                const containerClassName = classNames(styles.menuContainer, {
                  [styles.open]: isOpen
                });
                const menuClassName = classNames(styles.menu, {
                  [styles.noScrollbar]: !showScrollbar
                });
                return (
                  <div
                    style={style}
                    data-placement={placement}
                    className={containerClassName}
                    {...getMenuProps({})}
                  >
                    {isOpen ? (
                      <ul ref={ref} className={menuClassName}>
                        {options.map((option, index) => {
                          const className = classNames({
                            [styles.highlighted]: highlightedIndex === index,
                            [styles.selected]: selectedItem === option
                          });
                          return (
                            <li
                              {...getItemProps({
                                key: option.id,
                                index,
                                item: option,
                                className,
                                "aria-selected": selectedItem === option
                              })}
                            >
                              {option.label}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              }}
            </Popper>
          </Manager>
        </div>
      )}
    </Downshift>
  );
};

export default Dropdown;
