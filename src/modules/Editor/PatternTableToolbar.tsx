import { isEmpty, isNil } from "lodash";
import React from "react";
import { Action, ActionTypes } from "../../reducer";
import Button from "../../shared/Button";
import { PatternTable, PatternTableType } from "../../types";
import ButtonToolbar from "./ButtonToolbar";
import RenameModal from "./RenameModal";

type Props = {
  type: PatternTableType;
  patternTables: Array<PatternTable>;
  currentTable: PatternTable | null;
  dispatch: React.Dispatch<Action>;
};

const PatternTableToolbar = ({
  type,
  patternTables,
  currentTable,
  dispatch
}: Props) => {
  const [renameModalIsOpen, setRenameModalIsOpen] = React.useState(false);
  const hasNoOptions = isNil(currentTable) || isEmpty(patternTables);

  return (
    <ButtonToolbar>
      <Button
        ariaLabel={`Add a new ${type} pattern table`}
        size="small"
        onClick={() =>
          dispatch({
            type: ActionTypes.ADD_NEW_PATTERN_TABLE,
            payload: { type, label: "New pattern table" }
          })
        }
      >
        New
      </Button>
      <Button
        ariaLabel={`Edit the current ${type} pattern table`}
        disabled={hasNoOptions}
        size="small"
        onClick={() => setRenameModalIsOpen(true)}
      >
        Rename
      </Button>
      <Button
        ariaLabel={`Copy the current ${type} pattern table`}
        disabled={hasNoOptions}
        size="small"
        onClick={() =>
          currentTable &&
          dispatch({
            type: ActionTypes.COPY_PATTERN_TABLE,
            payload: { type, id: currentTable.id }
          })
        }
      >
        Copy
      </Button>
      <Button
        ariaLabel={`Delete the current ${type} pattern table`}
        disabled={hasNoOptions}
        size="small"
        onClick={() =>
          currentTable &&
          dispatch({
            type: ActionTypes.DELETE_PATTERN_TABLE,
            payload: { type, id: currentTable.id }
          })
        }
      >
        Delete
      </Button>
      <RenameModal
        isOpen={renameModalIsOpen}
        name={currentTable ? currentTable.label : ""}
        onClose={() => setRenameModalIsOpen(false)}
        onRename={(label: string) =>
          currentTable &&
          dispatch({
            type: ActionTypes.UPDATE_PATTERN_TABLE_METADATA,
            payload: {
              type,
              id: currentTable.id,
              label
            }
          })
        }
      />
    </ButtonToolbar>
  );
};

export default React.memo(PatternTableToolbar);
