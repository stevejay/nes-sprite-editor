import React from "react";
import styles from "./EditorSidebar.module.scss";
import PaletteColorInput from "./PaletteColorInput";
import PaletteContainer from "./PaletteContainer";
import RadioInput from "./RadioInput";
import { GamePaletteChange, GamePaletteWithColors } from "./reducer";
import { Color, SystemPalette as SystemPaletteType } from "./types";

type Props = {
  systemPalettes: Array<SystemPaletteType>;
  systemPalette: SystemPaletteType;
  onSystemPaletteChange: (id: SystemPaletteType["id"]) => void;
  backgroundColor: Color;
  onBackgroundColorChange: (color: Color) => void;
  backgroundPalettes: Array<GamePaletteWithColors>;
  spritePalettes: Array<GamePaletteWithColors>;
  onGamePaletteChange: (gamePaletteChange: GamePaletteChange) => void;
};

const EditorSidebar: React.FunctionComponent<Props> = ({
  systemPalettes,
  systemPalette,
  onSystemPaletteChange,
  backgroundColor,
  onBackgroundColorChange,
  backgroundPalettes,
  spritePalettes,
  onGamePaletteChange
}) => (
  <div className={styles.sidebar}>
    <section className={styles.section}>
      <header>
        <h1>System Palette</h1>
      </header>
      <RadioInput.Group
        legend="System palette to use:"
        options={systemPalettes}
        selectedId={systemPalette.id}
        onChange={onSystemPaletteChange}
      />
    </section>
    <section className={styles.section}>
      <header>
        <h1>Game Palette</h1>
      </header>
      <h2>Background Color</h2>
      <div className={styles.palette}>
        <PaletteContainer className={styles.paletteContainer}>
          <PaletteColorInput
            color={backgroundColor}
            systemPalette={systemPalette}
            onChange={onBackgroundColorChange}
          />
        </PaletteContainer>
      </div>
      <h2>Background Palettes</h2>
      {backgroundPalettes.map(palette => (
        <div key={palette.id} className={styles.palette}>
          <h3>#{palette.id}</h3>
          <PaletteContainer>
            {palette.colors.map((color, index) => (
              <PaletteColorInput
                key={index}
                color={color}
                systemPalette={systemPalette}
                onChange={color =>
                  onGamePaletteChange({
                    gamePalette: palette,
                    valueIndex: index,
                    newColor: color
                  })
                }
              />
            ))}
          </PaletteContainer>
        </div>
      ))}
      <h2>Sprite Palettes</h2>
      {spritePalettes.map(palette => (
        <div key={palette.id} className={styles.palette}>
          <h3>#{palette.id}</h3>
          <PaletteContainer>
            {palette.colors.map((color, index) => (
              <PaletteColorInput
                key={index}
                color={color}
                systemPalette={systemPalette}
                onChange={color =>
                  onGamePaletteChange({
                    gamePalette: palette,
                    valueIndex: index,
                    newColor: color
                  })
                }
              />
            ))}
          </PaletteContainer>
        </div>
      ))}
    </section>
  </div>
);

export default EditorSidebar;
