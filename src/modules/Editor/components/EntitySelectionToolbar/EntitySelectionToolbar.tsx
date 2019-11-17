import React from "react";
import SelectInput from "shared/SelectInput";
import Toolbar from "modules/editor/components/Toolbar";
import styles from "./EntitySelectionToolbar.module.scss";
import DropdownMenu from "shared/DropdownMenu";
import RenameEntityModal from "./RenameEntityModal";
import { COLLECTION_OPTIONS, CollectionOperationTypes } from "./constants";

export type Entity = {
  id: string;
  label: string;
};

type Props = {
  entities: Array<Entity>;
  currentEntity: Entity | null;
  entityName: string;
  onSelected: (id: Entity["id"]) => void;
  onNewEntity: () => void;
  onCopyEntity: (id: Entity["id"]) => void;
  onDeleteEntity: (id: Entity["id"]) => void;
  onRenameEntity: (id: Entity["id"], name: Entity["label"]) => void;
};

const EntitySelectionToolbar = ({
  entities,
  currentEntity,
  onSelected,
  onNewEntity,
  onCopyEntity,
  onDeleteEntity,
  onRenameEntity
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMenuItemSelected = (id: string) => {
    switch (id) {
      case CollectionOperationTypes.NEW:
        onNewEntity();
        break;
      case CollectionOperationTypes.COPY:
        currentEntity && onCopyEntity(currentEntity.id);
        break;
      case CollectionOperationTypes.DELETE:
        currentEntity && onDeleteEntity(currentEntity.id);
        break;
      case CollectionOperationTypes.RENAME:
        setIsOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Toolbar.Container className={styles.container}>
        <Toolbar>
          <SelectInput
            options={entities}
            value={currentEntity ? currentEntity.id : null}
            onChange={onSelected}
          />
        </Toolbar>
        <Toolbar>
          <DropdownMenu
            options={COLLECTION_OPTIONS}
            onMenuItemSelected={handleMenuItemSelected}
          />
        </Toolbar>
      </Toolbar.Container>
      <RenameEntityModal
        isOpen={isOpen}
        name={currentEntity ? currentEntity.label : ""}
        onClose={() => setIsOpen(false)}
        onRename={name =>
          currentEntity && onRenameEntity(currentEntity.id, name)
        }
      />
    </>
  );
};

export default React.memo(
  EntitySelectionToolbar,
  (prevProps, nextProps) =>
    prevProps.entities === nextProps.entities &&
    prevProps.currentEntity === nextProps.currentEntity
);
