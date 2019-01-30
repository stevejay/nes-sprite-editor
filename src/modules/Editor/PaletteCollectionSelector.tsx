import React from "react";
import {
  Action,
  ActionTypes,
  GamePaletteCollectionWithColors
} from "../../reducer";
import SelectInput from "../../shared/SelectInput";
import { GamePaletteCollection, GamePaletteType } from "../../types";

type Props = {
  type: GamePaletteType;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const PaletteCollectionSelector: React.FunctionComponent<Props> = ({
  type,
  paletteCollections,
  currentCollection,
  dispatch
}) => (
  <SelectInput<string>
    options={paletteCollections}
    value={currentCollection ? currentCollection.id : null}
    onChange={id =>
      dispatch({
        type: ActionTypes.SELECT_PALETTE_COLLECTION,
        payload: { type, id }
      })
    }
  />
);

export default PaletteCollectionSelector;
