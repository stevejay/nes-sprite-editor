import { range } from "lodash";
import React from "react";
import Button from "../../../../shared/Button";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import { UNAVAILABLE_COLOR } from "../../constants";
import { GamePaletteCollectionWithColors } from "../../store";
import Toolbar from "../Toolbar";
import styles from "./PaletteSelectionToolbar.module.scss";

type Props = {
  paletteIndex: number | null;
  paletteCollection: GamePaletteCollectionWithColors;
  onPaletteSelected: (index: number) => void;
};

const PaletteSelectionToolbar = ({
  paletteIndex,
  paletteCollection,
  onPaletteSelected
}: Props) => (
  <Toolbar>
    <RovingTabIndexProvider>
      {range(0, 4).map(index => {
        const selected = paletteIndex === index;
        return (
          <Button.WithRovingTabIndex
            key={index}
            aria-label={`Select palette #${index}`}
            appearance={selected ? "dark" : "default"}
            onClick={() => onPaletteSelected(index)}
            className={styles.button}
          >
            <span className={styles.swatch}>
              {paletteCollection.gamePalettes[index].colors.map(
                (color, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: color.available
                        ? color.rgb
                        : UNAVAILABLE_COLOR
                    }}
                  />
                )
              )}
            </span>
          </Button.WithRovingTabIndex>
        );
      })}
    </RovingTabIndexProvider>
  </Toolbar>
);

export default React.memo(
  PaletteSelectionToolbar,
  (prevProps, nextProps) =>
    prevProps.paletteIndex === nextProps.paletteIndex &&
    prevProps.paletteCollection === nextProps.paletteCollection
);
