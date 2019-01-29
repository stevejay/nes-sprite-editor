import { isEmpty, isNil, uniqueId } from "lodash";
import React from "react";
import {
  Action,
  ActionTypes,
  GamePaletteCollectionWithColors
} from "../../reducer";
import SelectInput from "../../shared/SelectInput";
import { GamePaletteCollection, SystemPalette } from "../../types";
import Section from "./Section";
import styles from "./BackgroundPalettesSection.module.scss";
import PaletteToolbar from "./PaletteToolbar";
import PaletteToolbarColorInput from "./PaletteToolbarColorInput";
import PaletteCollectionToolbar from "./PaletteCollectionToolbar";

type Props = {
  systemPalette: SystemPalette;
  paletteCollections: Array<GamePaletteCollection>;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const BackgroundPalettesSection: React.FunctionComponent<Props> = ({
  systemPalette,
  paletteCollections,
  currentPaletteCollection,
  dispatch
}) => {
  const selectId = React.useRef(uniqueId());
  const noPalettes =
    isNil(currentPaletteCollection) || isEmpty(paletteCollections);
  return (
    <Section>
      <header>
        <h1>Background Palettes</h1>
      </header>
      <h2>Current Collection</h2>
      <div className={styles.buttonRow}>
        <SelectInput<string>
          id={selectId.current}
          options={paletteCollections}
          selectedId={
            currentPaletteCollection ? currentPaletteCollection.id : null
          }
          onChange={id =>
            dispatch({
              type: ActionTypes.SELECT_PALETTE_COLLECTION,
              payload: { type: "background", id }
            })
          }
        />
      </div>
      <PaletteCollectionToolbar
        type="background"
        paletteCollections={paletteCollections}
        currentPaletteCollection={currentPaletteCollection}
        dispatch={dispatch}
      />
      <h2>Collection Palettes</h2>
      {!currentPaletteCollection && <p>No current collection</p>}
      {currentPaletteCollection &&
        currentPaletteCollection.gamePalettes.map((palette, paletteIndex) => (
          <div key={paletteIndex} className={styles.palette}>
            <h3>
              <span className="screen-reader-only">Background palette </span>#
              {paletteIndex}
            </h3>
            <PaletteToolbar ariaLabel="Color edit toolbar">
              {palette.colors.map((color, colorIndex) => (
                <PaletteToolbarColorInput
                  key={colorIndex}
                  index={colorIndex}
                  color={color}
                  systemPalette={systemPalette}
                  onChange={color =>
                    dispatch({
                      type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
                      payload: {
                        type: "background",
                        paletteCollectionId: currentPaletteCollection.id,
                        gamePaletteIndex: paletteIndex,
                        valueIndex: colorIndex,
                        newColor: color
                      }
                    })
                  }
                />
              ))}
            </PaletteToolbar>
          </div>
        ))}
    </Section>
  );
};

export default BackgroundPalettesSection;
