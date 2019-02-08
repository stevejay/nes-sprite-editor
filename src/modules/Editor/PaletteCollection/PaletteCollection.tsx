import React from "react";
import {
  GamePaletteType,
  SystemPalette,
  GamePaletteCollectionWithColors,
  Color
} from "../../../types";
import styles from "./PaletteCollection.module.scss";
import PaletteColorInput from "../../../shared/PaletteColorInput";
import { RovingTabIndexProvider } from "../../../shared/RovingTabIndex";

type Props = {
  type: GamePaletteType;
  systemPalette: SystemPalette;
  currentCollection: GamePaletteCollectionWithColors | null;
  onChangePaletteColor: (
    paletteCollectionId: string,
    gamePaletteIndex: number,
    valueIndex: number,
    newColor: Color
  ) => void;
};

const PaletteCollection = ({
  type,
  systemPalette,
  currentCollection,
  onChangePaletteColor
}: Props) => {
  const firstColorIndex = type === "sprite" ? 1 : 0;
  return (
    <>
      {!currentCollection && <p>No current collection</p>}
      {currentCollection &&
        currentCollection.gamePalettes.map((palette, paletteIndex) => (
          <div key={paletteIndex} className={styles.palette}>
            <h4>
              <span className="screen-reader-only">{type} palette </span>#
              {paletteIndex}
            </h4>
            <PaletteColorInput.Container
              ariaLabel="Color edit toolbar"
              ariaOrientation="horizontal"
              role="toolbar"
            >
              <RovingTabIndexProvider>
                {palette.colors
                  .filter((_color, colorIndex) => colorIndex >= firstColorIndex)
                  .map((color, colorIndex) => (
                    <PaletteColorInput
                      key={colorIndex}
                      color={color}
                      systemPalette={systemPalette}
                      onChange={color =>
                        onChangePaletteColor(
                          currentCollection.id,
                          paletteIndex,
                          colorIndex + firstColorIndex,
                          color
                        )
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
