import React from "react";
import styles from "./Editor.module.scss";
// import EditorSidebar from "./EditorSidebar";
import {
  Action,
  ActionTypes,
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
  selectCurrentSpritePatternTable
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

  // const patternTable = selectCurrentBackgroundPatternTable(state);
  // const currentMetatilePalette = selectCurrentBackgroundMetatilePalette(state);
  // const [drawColorIndex, setDrawColorIndex] = React.useState(0);

  // const colorOptions = React.useMemo(
  //   () => {
  //     return currentMetatilePalette!.colors.map((color, index) => ({
  //       id: index,
  //       label: `$${formatByteAsHex(color.id)}`
  //     }));
  //   },
  //   [currentMetatilePalette]
  // );

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
        {/* <SpritePatternTablesSection
          patternTables={spritePatternTables}
          currentTable={currentSpritePatternTable}
          dispatch={dispatch}
        /> */}
        {/* <Section>
        <header>
          <h1>Background Tiles</h1>
        </header>
        <h2>Pattern Table</h2>
        <BackgroundPatternTable
          tilesInRow={16}
          tilesInColumn={16}
          scaling={3}
          tiles={patternTable.tiles}
          currentMetatile={selectCurrentBackgroundMetatile(state)}
          palettes={selectBackgroundPalettes(state)}
          onSelectMetatile={(row, column) =>
            dispatch({
              type: ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE,
              payload: { row, column }
            })
          }
        />
        <h2>Selected Metatile</h2>
        <BackgroundPatternDetail
          tilesInRow={2}
          tilesInColumn={2}
          scaling={20}
          tiles={selectCurrentBackgroundMetatileTiles(state)}
          currentMetatile={selectCurrentBackgroundMetatile(state)}
          palettes={selectBackgroundPalettes(state)}
          onClicked={(tileIndex, pixelIndex) => {
            dispatch({
              type: ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE_PIXEL,
              payload: { tileIndex, pixelIndex, colorIndex: drawColorIndex }
            });
          }}
        />
        <RadioInput.Group
          legend="Palette:"
          options={PALETTE_OPTIONS}
          selectedId={
            selectCurrentBackgroundMetatileTiles(state)[0].gamePaletteId
          }
          onChange={id => {
            dispatch({
              type: ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE_PALETTE,
              payload: id
            });
          }}
          inline
        />
        <RadioInput.Group
          legend="Draw color:"
          options={colorOptions}
          selectedId={drawColorIndex}
          onChange={id => setDrawColorIndex(id)}
          inline
        />
      </Section> */}
      </div>
    </>
  );
};

export default Editor;
