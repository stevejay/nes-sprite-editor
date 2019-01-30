import React from "react";
import {
  Action,
  ActionTypes,
  GamePaletteCollectionWithColors
} from "../../reducer";
import { GamePaletteType, SystemPalette } from "../../types";
import styles from "./PaletteCollection.module.scss";
import PaletteToolbar from "./PaletteToolbar";
import PaletteToolbarColorInput from "./PaletteToolbarColorInput";

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
  const isSprite = type === "sprite" ? 1 : 0;
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
            <PaletteToolbar ariaLabel="Color edit toolbar">
              {palette.colors
                .filter((__, colorIndex) => colorIndex >= (isSprite ? 1 : 0))
                .map((color, colorIndex) => (
                  <PaletteToolbarColorInput
                    key={colorIndex}
                    index={colorIndex}
                    color={color}
                    systemPalette={systemPalette}
                    onChange={color =>
                      dispatch({
                        type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
                        payload: {
                          type,
                          paletteCollectionId: currentCollection.id,
                          gamePaletteIndex: paletteIndex,
                          valueIndex: colorIndex + (isSprite ? 1 : 0),
                          newColor: color
                        }
                      })
                    }
                  />
                ))}
            </PaletteToolbar>
          </div>
        ))}
    </>
  );
};

export default PaletteCollection;
