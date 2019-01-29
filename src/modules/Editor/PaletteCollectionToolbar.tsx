import React from "react";
import styles from "./PaletteCollectionToolbar.module.scss";
import Button from "../../shared/Button";
import {
  ActionTypes,
  GamePaletteCollectionWithColors,
  Action
} from "../../reducer";
import { isNil, isEmpty } from "lodash";
import { GamePaletteCollection, GamePaletteType } from "../../types";
import RenameModal from "./RenameModal";

type Props = {
  type: GamePaletteType;
  paletteCollections: Array<GamePaletteCollection>;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const PaletteCollectionToolbar = React.memo(
  ({ type, paletteCollections, currentPaletteCollection, dispatch }: Props) => {
    const [renameModalIsOpen, setRenameModalIsOpen] = React.useState(false);

    const hasNoPalettes =
      isNil(currentPaletteCollection) || isEmpty(paletteCollections);

    return (
      <div className={styles.container}>
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
          disabled={hasNoPalettes}
          size="small"
          onClick={() => setRenameModalIsOpen(true)}
        >
          Rename
        </Button>
        <Button
          ariaLabel={`Copy the current ${type} palette collection`}
          disabled={hasNoPalettes}
          size="small"
          onClick={() =>
            currentPaletteCollection &&
            dispatch({
              type: ActionTypes.COPY_PALETTE_COLLECTION,
              payload: { type, id: currentPaletteCollection.id }
            })
          }
        >
          Copy
        </Button>
        <Button
          ariaLabel={`Delete the current ${type} palette collection`}
          disabled={hasNoPalettes}
          size="small"
          onClick={() =>
            currentPaletteCollection &&
            dispatch({
              type: ActionTypes.DELETE_PALETTE_COLLECTION,
              payload: { type, id: currentPaletteCollection.id }
            })
          }
        >
          Delete
        </Button>
        <RenameModal
          isOpen={renameModalIsOpen}
          onClose={() => setRenameModalIsOpen(false)}
        />
      </div>
    );
  }
);

export default PaletteCollectionToolbar;
