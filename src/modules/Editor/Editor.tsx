import React from "react";
import {
  Action,
  selectBackgroundPaletteCollections,
  selectBackgroundPatternTables,
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable,
  selectCurrentSpritePaletteCollection,
  selectCurrentSystemPalette,
  selectNametables,
  selectSpritePaletteCollections,
  selectSystemPalettes,
  State
} from "../../reducer";
import BackgroundPalettesSection from "./BackgroundPalettesSection";
import BackgroundPatternTablesSection from "./BackgroundPatternTablesSection";
import styles from "./Editor.module.scss";
import NametablesSection from "./NametablesSection";
import SpritePalettesSection from "./SpritePalettesSection";
import SystemPaletteSection from "./SystemPaletteSection";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FunctionComponent<Props> = ({ state, dispatch }) => {
  const systemPalettes = selectSystemPalettes(state);
  const currentSystemPalette = selectCurrentSystemPalette(state);
  const backgroundPaletteCollections = selectBackgroundPaletteCollections(
    state
  );
  const currentBackgroundPaletteCollection = selectCurrentBackgroundPaletteCollection(
    state
  );
  const spritePaletteCollections = selectSpritePaletteCollections(state);
  const currentSpritePaletteCollection = selectCurrentSpritePaletteCollection(
    state
  );
  const backgroundPatternTables = selectBackgroundPatternTables(state);
  const currentBackgroundPatternTable = selectCurrentBackgroundPatternTable(
    state
  );
  const nametables = selectNametables(state);
  const currentNametable = selectCurrentNametable(state);

  return (
    <>
      <div className={styles.container}>
        <SystemPaletteSection
          systemPalettes={systemPalettes}
          currentSystemPalette={currentSystemPalette}
          dispatch={dispatch}
        />
        <BackgroundPalettesSection
          systemPalette={currentSystemPalette}
          paletteCollections={backgroundPaletteCollections}
          currentCollection={currentBackgroundPaletteCollection}
          dispatch={dispatch}
        />
        <SpritePalettesSection
          systemPalette={currentSystemPalette}
          paletteCollections={spritePaletteCollections}
          currentCollection={currentSpritePaletteCollection}
          dispatch={dispatch}
        />
      </div>
      <div className={styles.container}>
        <BackgroundPatternTablesSection
          patternTables={backgroundPatternTables}
          currentTable={currentBackgroundPatternTable}
          currentPaletteCollection={currentBackgroundPaletteCollection}
          dispatch={dispatch}
        />
        <NametablesSection
          nametables={nametables}
          currentNametable={currentNametable}
          currentPatternTable={currentBackgroundPatternTable}
          currentPaletteCollection={currentBackgroundPaletteCollection}
          dispatch={dispatch}
        />
      </div>
    </>
  );
};

export default Editor;
