import React from "react";
import styles from "./EntityManagementToolbar.module.scss";
import { isNil, isEmpty } from "lodash";
import { RovingTabIndexProvider } from "../../../shared/RovingTabIndex";
import Button from "../../../shared/Button";
import RenameEntityModal from "./RenameEntityModal";
import { Entity } from "../../../types";

type Props = {
  entities: Array<Entity>;
  currentEntity: Entity | null;
  entityName: string;
  onNewEntity: () => void;
  onCopyEntity: (id: string) => void;
  onDeleteEntity: (id: string) => void;
  onRenameEntity: (id: string, name: string) => void;
};

const EntityOptionToolbar = ({
  entities,
  currentEntity,
  entityName,
  onNewEntity,
  onCopyEntity,
  onDeleteEntity,
  onRenameEntity
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasNoOptions = isNil(currentEntity) || isEmpty(entities);

  return (
    <div className={styles.container}>
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
  );
};

export default React.memo(
  EntityOptionToolbar,
  (prevProps, nextProps) =>
    prevProps.entities === nextProps.entities &&
    prevProps.currentEntity === nextProps.currentEntity
);
