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
import { ReduxStateSlice } from "./redux";
import { connect } from "react-redux";

type Props = {
  currentSystemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
};

const SpritePalettesSection = ({
  currentSystemPalette,
  paletteCollections,
  currentCollection
}: Props) => (
  <Section>
    <header>
      <h2>Sprite Palettes</h2>
    </header>
    <h3>Current Collection</h3>
    <EntityManagementToolbar
      entities={paletteCollections}
      currentEntity={currentCollection}
      entityName="Sprite Palette"
      onSelected={setSpritePaletteCollection}
      onNewEntity={addNewSpritePaletteCollection}
      onCopyEntity={copySpritePaletteCollection}
      onDeleteEntity={deleteSpritePaletteCollection}
      onRenameEntity={renameSpritePaletteCollection}
    />
    <h3>Collection Palettes</h3>
    <PaletteCollection
      type="sprite"
      systemPalette={currentSystemPalette}
      currentCollection={currentCollection}
      dispatch={dispatch}
    />
  </Section>
);

export default connect(
  (state: ReduxStateSlice) => ({
    currentSystemPalette: selectCurrentSystemPalette(state),
    paletteCollections: selectSpritePaletteCollections(state),
    currentCollection: selectCurrentSpritePalettes(state)
  }),
  {
    setSpritePaletteCollection,
    addNewSpritePaletteCollection,
    copySpritePaletteCollection,
    deleteSpritePaletteCollection,
    renameSpritePaletteCollection,
    changeSpritePaletteColor
  }
)(SpritePalettesSection);
