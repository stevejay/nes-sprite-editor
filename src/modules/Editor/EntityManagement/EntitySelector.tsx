import React from "react";
import SelectInput from "../../../shared/SelectInput";
import { Entity } from "../../../types";

type Props = {
  entities: Array<Entity>;
  currentEntity: Entity | null;
  onChange: (id: string) => void;
};

const EntitySelector = ({ entities, currentEntity, onChange }: Props) => (
  <SelectInput<string>
    options={entities}
    value={currentEntity ? currentEntity.id : null}
    onChange={onChange}
  />
);

export default EntitySelector;
