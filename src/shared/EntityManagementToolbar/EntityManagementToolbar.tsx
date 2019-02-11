import { isEmpty, isNil } from "lodash";
import React from "react";
import Button from "../Button";
import { RovingTabIndexProvider } from "../RovingTabIndex";
import SelectInput from "../SelectInput";
import styles from "./EntityManagementToolbar.module.scss";
import RenameEntityModal from "./RenameEntityModal";

// TODO think about a different way of doing this:
type Entity = {
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

const EntityManagementToolbar = ({
  entities,
  currentEntity,
  entityName,
  onSelected,
  onNewEntity,
  onCopyEntity,
  onDeleteEntity,
  onRenameEntity
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasNoOptions = isNil(currentEntity) || isEmpty(entities);
  return (
    <div className={styles.container}>
      <SelectInput<string>
        options={entities}
        value={currentEntity ? currentEntity.id : null}
        onChange={onSelected}
      />
      <div className={styles.buttonsContainer}>
        <RovingTabIndexProvider>
          <Button.WithRovingTabIndex
            ariaLabel={`Create a new ${entityName}`}
            size="small"
            onClick={onNewEntity}
          >
            New
          </Button.WithRovingTabIndex>
          <Button.WithRovingTabIndex
            ariaLabel={`Rename the current ${entityName}`}
            disabled={hasNoOptions}
            size="small"
            onClick={() => setIsOpen(true)}
          >
            Rename
          </Button.WithRovingTabIndex>
          <Button.WithRovingTabIndex
            ariaLabel={`Copy the current ${entityName}`}
            disabled={hasNoOptions}
            size="small"
            onClick={() => currentEntity && onCopyEntity(currentEntity.id)}
          >
            Copy
          </Button.WithRovingTabIndex>
          <Button.WithRovingTabIndex
            ariaLabel={`Delete the current ${entityName}`}
            disabled={hasNoOptions}
            size="small"
            onClick={() => currentEntity && onDeleteEntity(currentEntity.id)}
          >
            Delete
          </Button.WithRovingTabIndex>
        </RovingTabIndexProvider>
        <RenameEntityModal
          isOpen={isOpen}
          name={currentEntity ? currentEntity.label : ""}
          onClose={() => setIsOpen(false)}
          onRename={name =>
            currentEntity && onRenameEntity(currentEntity.id, name)
          }
        />
      </div>
    </div>
  );
};

export default React.memo(
  EntityManagementToolbar,
  (prevProps, nextProps) =>
    prevProps.entities === nextProps.entities &&
    prevProps.currentEntity === nextProps.currentEntity
);
