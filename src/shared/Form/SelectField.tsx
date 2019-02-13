import { FieldContainer } from ".";
import React from "react";
import SelectInput, { Option } from "../SelectInput";
import useId from "../utils/use-id";
import Label from "./Label";

type Props<IdT> = {
  value: IdT;
  onChange: (value: IdT) => void;
  options: Array<Option<IdT>>;
  label: string;
  disabled?: boolean;
  name?: string;
};

const SelectField = <P extends string | number>({
  value,
  onChange,
  options,
  label,
  disabled,
  name
}: Props<P>) => {
  const id = useId();
  return (
    <FieldContainer>
      <Label forId={id}>{label}</Label>
      <SelectInput<P>
        id={id}
        name={name}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </FieldContainer>
  );
};

export default SelectField;
