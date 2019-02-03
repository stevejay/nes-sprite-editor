import React from "react";
import {
  Action,
  ActionTypes,
  GamePaletteCollectionWithColors
} from "../../reducer";
import { GamePaletteType, SystemPalette } from "../../types";
import styles from "./PaletteCollection.module.scss";
import PaletteColorInput from "../../shared/PaletteColorInput";
import { RovingTabIndexProvider } from "../../shared/RovingTabIndex";

type Props = {
  type: GamePaletteType;
  systemPalette: SystemPalette;
  currentCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const PaletteCollection = ({
  type,
  systemPalette,
  currentCollection,
  dispatch
}: Props) => {
  const firstColorIndex = type === "sprite" ? 1 : 0;
  return (
    <>
      {!currentCollection && <p>No current collection</p>}
      {currentCollection &&
        currentCollection.gamePalettes.map((palette, paletteIndex) => (
          <div key={paletteIndex} className={styles.palette}>
            <h3>
              <span className="screen-reader-only">{type} palette </span>#
              {paletteIndex}
            </h3>
            <PaletteColorInput.Container
              ariaLabel="Color edit toolbar"
              ariaOrientation="horizontal"
              role="toolbar"
            >
              <RovingTabIndexProvider>
                {palette.colors
                  .filter((__, colorIndex) => colorIndex >= firstColorIndex)
                  .map((color, colorIndex) => (
                    <PaletteColorInput
                      key={colorIndex}
                      color={color}
                      systemPalette={systemPalette}
                      onChange={color =>
                        dispatch({
                          type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
                          payload: {
                            type,
                            paletteCollectionId: currentCollection.id,
                            gamePaletteIndex: paletteIndex,
                            valueIndex: colorIndex + firstColorIndex,
                            newColor: color
                          }
                        })
                      }
                    />
                  ))}
              </RovingTabIndexProvider>
            </PaletteColorInput.Container>
          </div>
        ))}
    </>
  );
};

export default PaletteCollection;
