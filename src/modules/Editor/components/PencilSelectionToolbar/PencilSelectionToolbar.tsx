import { range } from "lodash";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import Button from "../../../../shared/Button";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import { UNAVAILABLE_COLOR } from "../../constants";
import { GamePaletteWithColors } from "../../store";
import Toolbar from "../Toolbar";
import styles from "./PencilSelectionToolbar.module.scss";

type Props = {
  colorIndex: number | null;
  currentPalette: GamePaletteWithColors;
  onPencilSelected: (index: number) => void;
};

const PencilSelectionToolbar = ({
  colorIndex,
  currentPalette,
  onPencilSelected
}: Props) => (
  <Toolbar>
    <RovingTabIndexProvider>
      {range(0, 4).map(index => {
        const selected = colorIndex === index;
        const color = currentPalette.colors[index];
        return (
          <Button.WithRovingTabIndex
            key={index}
            aria-label={`Pencil tool for color #${index}`}
            icon={FiEdit2}
            appearance={selected ? "dark" : "default"}
            onClick={() => onPencilSelected(index)}
            className={styles.button}
          >
            <span
              className={styles.swatch}
              style={{
                backgroundColor: color.available ? color.rgb : UNAVAILABLE_COLOR
              }}
            />
          </Button.WithRovingTabIndex>
        );
      })}
    </RovingTabIndexProvider>
  </Toolbar>
);

export default React.memo(
  PencilSelectionToolbar,
  (prevProps, nextProps) =>
    prevProps.colorIndex === nextProps.colorIndex &&
    prevProps.currentPalette === nextProps.currentPalette
);
