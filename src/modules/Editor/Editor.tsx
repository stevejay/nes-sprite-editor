import React from "react";
import styles from "./Editor.module.scss";
// import EditorSidebar from "./EditorSidebar";
import {
  Action,
  selectCurrentSystemPalette,
  selectSystemPalettes,
  State,
  selectBackgroundPaletteCollections,
  selectCurrentBackgroundPaletteCollection,
  selectSpritePaletteCollections,
  selectCurrentSpritePaletteCollection,
  selectBackgroundPatternTables,
  selectCurrentBackgroundPatternTable,
  selectSpritePatternTables,
  selectCurrentSpritePatternTable,
  selectNametables,
  selectCurrentNametable
} from "../../reducer";
// import Section from "./Section";
// import BackgroundPatternTable from "./BackgroundPatternTable";
// import BackgroundPatternDetail from "./BackgroundPatternDetail";
// import RadioInput from "../../shared/RadioInput";
// import formatByteAsHex from "../../shared/utils/format-byte-as-hex";
import SystemPaletteSection from "./SystemPaletteSection";
import BackgroundPalettesSection from "./BackgroundPalettesSection";
import SpritePalettesSection from "./SpritePalettesSection";
import BackgroundPatternTablesSection from "./BackgroundPatternTablesSection";
import NametablesSection from "./NametablesSection";

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
  const spritePatternTables = selectSpritePatternTables(state);
  const currentSpritePatternTable = selectCurrentSpritePatternTable(state);
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
