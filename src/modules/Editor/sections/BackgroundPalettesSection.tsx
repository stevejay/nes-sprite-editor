import React from "react";
import { connect } from "react-redux";
import Section from "shared/Section";
import EntitySelectionToolbar from "modules/editor/components/EntitySelectionToolbar";
import PaletteCollection from "modules/editor/components/PaletteCollection";
import {
  addNewBackgroundPaletteCollection,
  changePaletteColor,
  copyPaletteCollection,
  deletePaletteCollection,
  EditorStateSlice,
  GamePaletteCollection,
  GamePaletteCollectionWithColors,
  renamePaletteCollection,
  selectBackgroundPaletteCollections,
  selectCurrentBackgroundPaletteCollection,
  selectCurrentSystemPalette,
  setPaletteCollection,
  SystemPalette
} from "modules/editor/store";

type Props = {
  systemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentCollection: GamePaletteCollectionWithColors | null;
  setPaletteCollection: typeof setPaletteCollection;
  addNewBackgroundPaletteCollection: typeof addNewBackgroundPaletteCollection;
  copyPaletteCollection: typeof copyPaletteCollection;
  deletePaletteCollection: typeof deletePaletteCollection;
  renamePaletteCollection: typeof renamePaletteCollection;
  changePaletteColor: typeof changePaletteColor;
};

const BackgroundPalettesSection = ({
  systemPalette,
  paletteCollections,
  currentCollection,
  setPaletteCollection,
  addNewBackgroundPaletteCollection,
  copyPaletteCollection,
  deletePaletteCollection,
  renamePaletteCollection,
  changePaletteColor
}: Props) => (
  <Section>
    <header>
      <h2>Background Palettes</h2>
    </header>
    <h3>Current Collection</h3>
    <EntitySelectionToolbar
      entities={paletteCollections}
      currentEntity={currentCollection}
      entityName="Background Palette"
      onSelected={setPaletteCollection}
      onNewEntity={addNewBackgroundPaletteCollection}
      onCopyEntity={copyPaletteCollection}
      onDeleteEntity={deletePaletteCollection}
      onRenameEntity={renamePaletteCollection}
    />
    <h3>Collection Palettes</h3>
    <PaletteCollection
      type="background"
      systemPalette={systemPalette}
      currentCollection={currentCollection}
      onChangePaletteColor={changePaletteColor}
    />
  </Section>
);

export default connect(
  (state: EditorStateSlice) => ({
    systemPalette: selectCurrentSystemPalette(state),
    paletteCollections: selectBackgroundPaletteCollections(state),
    currentCollection: selectCurrentBackgroundPaletteCollection(state)
  }),
  {
    setPaletteCollection,
    addNewBackgroundPaletteCollection,
    copyPaletteCollection,
    deletePaletteCollection,
    renamePaletteCollection,
    changePaletteColor
  }
)(
  React.memo(
    BackgroundPalettesSection,
    (prevProps, nextProps) =>
      prevProps.systemPalette === nextProps.systemPalette &&
      prevProps.paletteCollections === nextProps.paletteCollections &&
      prevProps.currentCollection === nextProps.currentCollection
  )
);
