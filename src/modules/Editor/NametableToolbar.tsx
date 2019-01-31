import React from "react";
import Button from "../../shared/Button";
import { ActionTypes, Action } from "../../reducer";
import { isNil, isEmpty } from "lodash";
import RenameModal from "./RenameModal";
import ButtonToolbar from "./ButtonToolbar";
import { Nametable } from "../../types";

type Props = {
  nametables: Array<Nametable>;
  currentNametable: Nametable | null;
  dispatch: React.Dispatch<Action>;
};

const NametableToolbar = ({
  nametables,
  currentNametable,
  dispatch
}: Props) => {
  const [renameModalIsOpen, setRenameModalIsOpen] = React.useState(false);
  const hasNoOptions = isNil(currentNametable) || isEmpty(nametables);

  return (
    <ButtonToolbar>
      <Button
        ariaLabel="Add a new nametable"
        size="small"
        onClick={() =>
          dispatch({
            type: ActionTypes.ADD_NEW_NAMETABLE,
            payload: { label: "New nametable" }
          })
        }
      >
        New
      </Button>
      <Button
        ariaLabel="Edit the current nametable"
        disabled={hasNoOptions}
        size="small"
        onClick={() => setRenameModalIsOpen(true)}
      >
        Rename
      </Button>
      <Button
        ariaLabel="Copy the current nametable"
        disabled={hasNoOptions}
        size="small"
        onClick={() =>
          currentNametable &&
          dispatch({
            type: ActionTypes.COPY_NAMETABLE,
            payload: { id: currentNametable.id }
          })
        }
      >
        Copy
      </Button>
      <Button
        ariaLabel="Delete the current nametable"
        disabled={hasNoOptions}
        size="small"
        onClick={() =>
          currentNametable &&
          dispatch({
            type: ActionTypes.DELETE_NAMETABLE,
            payload: { id: currentNametable.id }
          })
        }
      >
        Delete
      </Button>
      <RenameModal
        isOpen={renameModalIsOpen}
        name={currentNametable ? currentNametable.label : ""}
        onClose={() => setRenameModalIsOpen(false)}
        onRename={(label: string) =>
          currentNametable &&
          dispatch({
            type: ActionTypes.UPDATE_NAMETABLE_METADATA,
            payload: {
              id: currentNametable.id,
              label
            }
          })
        }
      />
    </ButtonToolbar>
  );
};

export default React.memo(NametableToolbar);
