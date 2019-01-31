import React from "react";
import styles from "./TextField.module.scss";
import { uniqueId } from "lodash";
import TextInput from "../TextInput";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps & {
  label: string;
  type?: "text";
  disabled?: boolean;
  name: string;
};

const TextField = ({ input, label, type, disabled, name }: Props) => {
  const id = React.useRef(uniqueId("text-field_"));
  return (
    <div className={styles.container}>
      <label htmlFor={id.current}>{label}</label>
      <TextInput
        type={type}
        value={input.value}
        name={name}
        disabled={disabled}
        id={id.current}
        onChange={input.onChange}
      />
    </div>
  );
};

export default TextField;
