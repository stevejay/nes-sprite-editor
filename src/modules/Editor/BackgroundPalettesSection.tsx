import React from "react";
import {
  selectBackgroundPaletteCollections,
  selectCurrentBackgroundPalettes,
  selectCurrentSystemPalette,
  useEditorContext,
  ActionTypes
} from "../../contexts/editor";
import PaletteCollection from "./PaletteCollection";
import Section from "./Section";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";

const BackgroundPalettesSection = () => {
  const [state, dispatch] = useEditorContext();
  const currentSystemPalette = selectCurrentSystemPalette(state);
  const paletteCollections = selectBackgroundPaletteCollections(state);
  const currentCollection = selectCurrentBackgroundPalettes(state);

  return (
    <Section>
      <header>
        <h2>Background Palettes</h2>
      </header>
      <h3>Current Collection</h3>
      <EntityManagementToolbar
        entities={paletteCollections}
        currentEntity={currentCollection}
        entityName="Background Palette"
        onSelected={id =>
          dispatch({
            type: ActionTypes.SELECT_PALETTE_COLLECTION,
            payload: { type: "background", id }
          })
        }
        onNewEntity={() =>
          dispatch({
            type: ActionTypes.ADD_NEW_PALETTE_COLLECTION,
            payload: { type: "background", label: "New collection" }
          })
        }
        onCopyEntity={id =>
          dispatch({
            type: ActionTypes.COPY_PALETTE_COLLECTION,
            payload: { type: "background", id }
          })
        }
        onDeleteEntity={id =>
          dispatch({
            type: ActionTypes.DELETE_PALETTE_COLLECTION,
            payload: { type: "background", id }
          })
        }
        onRenameEntity={(id, label) =>
          dispatch({
            type: ActionTypes.UPDATE_PALETTE_COLLECTION_METADATA,
            payload: { type: "background", id, label }
          })
        }
      />
      <h3>Collection Palettes</h3>
      <PaletteCollection
        type="background"
        systemPalette={currentSystemPalette}
        currentCollection={currentCollection}
        dispatch={dispatch}
      />
    </Section>
  );
};

export default BackgroundPalettesSection;
