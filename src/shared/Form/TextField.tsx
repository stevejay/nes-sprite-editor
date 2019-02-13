import React from "react";
import TextInput from "../TextInput";
import Label from "./Label";
import useId from "../utils/use-id";
import { FieldContainer } from ".";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: "text";
  disabled?: boolean;
  name?: string;
};

const TextField = ({ value, onChange, label, type, disabled, name }: Props) => {
  const id = useId();
  return (
    <FieldContainer>
      <Label forId={id}>{label}</Label>
      <TextInput
        type={type}
        value={value}
        name={name}
        disabled={disabled}
        id={id}
        onChange={onChange}
      />
    </FieldContainer>
  );
};

export default TextField;
