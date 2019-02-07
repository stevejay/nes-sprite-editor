import React from "react";
import {
  Action,
  ActionTypes,
  GamePaletteCollectionWithColors
} from "../../reducer";
import { GamePaletteCollection, SystemPalette } from "../../types";
import EntityManagement from "./EntityManagement";
import PaletteCollection from "./PaletteCollection/PaletteCollection";
import Section from "./Section";

type Props = {
  systemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const SpritePalettesSection = ({
  systemPalette,
  paletteCollections,
  currentCollection,
  dispatch
}: Props) => (
  <Section>
    <header>
      <h2>Sprite Palettes</h2>
    </header>
    <h3>Current Collection</h3>
    <EntityManagement.Selector
      entities={paletteCollections}
      currentEntity={currentCollection}
      onChange={id =>
        dispatch({
          type: ActionTypes.SELECT_PALETTE_COLLECTION,
          payload: { type: "sprite", id }
        })
      }
    />
    <EntityManagement.Toolbar
      entities={paletteCollections}
      currentEntity={currentCollection}
      entityName="Sprite Palette"
      onNewEntity={() =>
        dispatch({
          type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
          payload: { type: "sprite", label: "New collection" }
        })
      }
      onCopyEntity={id =>
        dispatch({
          type: ActionTypes.COPY_PALETTE_COLLECTION,
          payload: { type: "sprite", id }
        })
      }
      onDeleteEntity={id =>
        dispatch({
          type: ActionTypes.DELETE_PALETTE_COLLECTION,
          payload: { type: "sprite", id }
        })
      }
      onRenameEntity={(id, label) =>
        dispatch({
          type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA,
          payload: { type: "sprite", id, label }
        })
      }
    />
    <h3>Collection Palettes</h3>
    <PaletteCollection
      type="sprite"
      systemPalette={systemPalette}
      currentCollection={currentCollection}
      dispatch={dispatch}
    />
  </Section>
);

export default SpritePalettesSection;
