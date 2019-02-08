import React from "react";
import PaletteCollection from "./PaletteCollection";
import Section from "./Section";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";
import { connect } from "react-redux";
import {
  ReduxStateSlice,
  selectCurrentSystemPalette,
  selectBackgroundPaletteCollections,
  selectCurrentBackgroundPalettes,
  setBackgroundPaletteCollection,
  addNewBackgroundPaletteCollection,
  copyBackgroundPaletteCollection,
  deleteBackgroundPaletteCollection,
  renameBackgroundPaletteCollection,
  changeBackgroundPaletteColor
} from "./redux";
import {
  GamePaletteCollectionWithColors,
  SystemPalette,
  GamePaletteCollection
} from "../../types";

type Props = {
  currentSystemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
};

const BackgroundPalettesSection = ({
  currentSystemPalette,
  paletteCollections,
  currentCollection
}: Props) => (
  <Section>
    <header>
      <h2>Background Palettes</h2>
    </header>
    <h3>Current Collection</h3>
    <EntityManagementToolbar
      entities={paletteCollections}
      currentEntity={currentCollection}
      entityName="Background Palette"
      onSelected={setBackgroundPaletteCollection}
      onNewEntity={addNewBackgroundPaletteCollection}
      onCopyEntity={copyBackgroundPaletteCollection}
      onDeleteEntity={deleteBackgroundPaletteCollection}
      onRenameEntity={renameBackgroundPaletteCollection}
    />
    <h3>Collection Palettes</h3>
    <PaletteCollection
      type="background"
      systemPalette={currentSystemPalette}
      currentCollection={currentCollection}
      onChangePaletteColor={changeBackgroundPaletteColor}
    />
  </Section>
);

export default connect(
  (state: ReduxStateSlice) => ({
    currentSystemPalette: selectCurrentSystemPalette(state),
    paletteCollections: selectBackgroundPaletteCollections(state),
    currentCollection: selectCurrentBackgroundPalettes(state)
  }),
  {
    setBackgroundPaletteCollection,
    addNewBackgroundPaletteCollection,
    copyBackgroundPaletteCollection,
    deleteBackgroundPaletteCollection,
    renameBackgroundPaletteCollection,
    changeBackgroundPaletteColor
  }
)(BackgroundPalettesSection);
