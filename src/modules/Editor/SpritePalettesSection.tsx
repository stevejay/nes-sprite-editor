import React from "react";
import PaletteCollection from "./PaletteCollection";
import Section from "./Section";
import {
  selectCurrentSystemPalette,
  selectSpritePaletteCollections,
  selectCurrentSpritePalettes,
  ActionTypes,
  useEditorContext
} from "../../contexts/editor";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";

const SpritePalettesSection = () => {
  const [state, dispatch] = useEditorContext();
  const currentSystemPalette = selectCurrentSystemPalette(state);
  const paletteCollections = selectSpritePaletteCollections(state);
  const currentPaletteCollection = selectCurrentSpritePalettes(state);

  return (
    <Section>
      <header>
        <h2>Sprite Palettes</h2>
      </header>
      <h3>Current Collection</h3>
      <EntityManagementToolbar
        entities={paletteCollections}
        currentEntity={currentPaletteCollection}
        entityName="Sprite Palette"
        onSelected={id =>
          dispatch({
            type: ActionTypes.SELECT_PALETTE_COLLECTION,
            payload: { type: "sprite", id }
          })
        }
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
        systemPalette={currentSystemPalette}
        currentCollection={currentPaletteCollection}
        dispatch={dispatch}
      />
    </Section>
  );
};

export default SpritePalettesSection;
