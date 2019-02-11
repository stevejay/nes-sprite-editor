import React from "react";
import styles from "./TextField.module.scss";
import { uniqueId } from "lodash";
import TextInput from "../TextInput";
import { FieldRenderProps } from "react-final-form";
import Label from "./Label";
import useId from "../utils/use-id";

type Props = FieldRenderProps & {
  label: string;
  type?: "text";
  disabled?: boolean;
  name: string;
};

const TextField = ({ input, label, type, disabled, name }: Props) => {
  const id = useId();
  return (
    <div className={styles.container}>
      <Label forId={id} label={label} />
      <TextInput
        type={type}
        value={input.value}
        name={name}
        disabled={disabled}
        id={id}
        onChange={input.onChange}
      />
    </div>
  );
};

export default TextField;
