import React from "react";
import Button from "../../shared/Button";
import {
  ActionTypes,
  GamePaletteCollectionWithColors,
  Action
} from "../../reducer";
import { isNil, isEmpty } from "lodash";
import { GamePaletteCollection, GamePaletteType } from "../../types";
import RenameModal from "./RenameModal";
import ButtonToolbar from "./ButtonToolbar";

type Props = {
  type: GamePaletteType;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const PaletteCollectionToolbar = ({
  type,
  paletteCollections,
  currentCollection,
  dispatch
}: Props) => {
  const [renameModalIsOpen, setRenameModalIsOpen] = React.useState(false);
  const hasNoOptions = isNil(currentCollection) || isEmpty(paletteCollections);

  return (
    <ButtonToolbar>
      <Button
        ariaLabel={`Add a new ${type} palette collection`}
        size="small"
        onClick={() =>
          dispatch({
            type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
            payload: { type, label: "New collection" }
          })
        }
      >
        New
      </Button>
      <Button
        ariaLabel={`Edit the current ${type} palette collection`}
        disabled={hasNoOptions}
        size="small"
        onClick={() => setRenameModalIsOpen(true)}
      >
        Rename
      </Button>
      <Button
        ariaLabel={`Copy the current ${type} palette collection`}
        disabled={hasNoOptions}
        size="small"
        onClick={() =>
          currentCollection &&
          dispatch({
            type: ActionTypes.COPY_PALETTE_COLLECTION,
            payload: { type, id: currentCollection.id }
          })
        }
      >
        Copy
      </Button>
      <Button
        ariaLabel={`Delete the current ${type} palette collection`}
        disabled={hasNoOptions}
        size="small"
        onClick={() =>
          currentCollection &&
          dispatch({
            type: ActionTypes.DELETE_PALETTE_COLLECTION,
            payload: { type, id: currentCollection.id }
          })
        }
      >
        Delete
      </Button>
      <RenameModal
        isOpen={renameModalIsOpen}
        name={currentCollection ? currentCollection.label : ""}
        onClose={() => setRenameModalIsOpen(false)}
        onRename={(label: string) =>
          currentCollection &&
          dispatch({
            type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA,
            payload: {
              type,
              id: currentCollection.id,
              label
            }
          })
        }
      />
    </ButtonToolbar>
  );
};

export default React.memo(PaletteCollectionToolbar);
