import { Manager, Reference, Popper } from "react-popper";
import React from "react";
import Downshift from "downshift";
import styles from "./DropdownMenu.module.scss";
import Button from "../Button";
import classNames from "classnames";
import { FiSettings } from "react-icons/fi";

type Option = {
  id: string;
  label: string;
};

type Props = {
  options: Array<Option>;
  disabled?: boolean;
  onMenuItemSelected: (id: Option["id"]) => void;
};

const DropdownMenu = ({
  options,
  disabled = false,
  onMenuItemSelected
}: Props) => (
  <Downshift
    onSelect={selection => onMenuItemSelected(selection.id)}
    itemToString={item => (item ? item.label : "")}
  >
    {({
      getItemProps,
      getMenuProps,
      getToggleButtonProps,
      isOpen,
      highlightedIndex
    }) => (
      <div className={styles.container}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <Button
                ref={ref}
                icon={FiSettings}
                className={styles.toggleButton}
                appearance="default"
                disabled={disabled}
                {...getToggleButtonProps({})}
              />
            )}
          </Reference>
          <Popper placement="bottom-end">
            {({ ref, style, placement }) => {
              const containerClassName = classNames(styles.menuContainer, {
                [styles.open]: !!isOpen
              });
              return (
                <div
                  data-placement={placement}
                  className={containerClassName}
                  {...getMenuProps({
                    style
                  })}
                >
                  {isOpen ? (
                    <ul ref={ref} className={styles.menu}>
                      {options.map((option, index) => {
                        const className = classNames({
                          [styles.highlighted]: highlightedIndex === index
                        });
                        return (
                          <li
                            {...getItemProps({
                              key: option.id,
                              index,
                              item: option,
                              className,
                              "aria-selected": false
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

export default DropdownMenu;
