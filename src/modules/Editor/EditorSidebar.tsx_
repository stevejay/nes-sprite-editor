import { tail } from "lodash";
import React from "react";
import { GamePaletteChange, GamePaletteWithColors } from "../../reducer";
import PaletteColorInput from "../../shared/PaletteColorInput";
import Panel from "../../shared/Panel";
import RadioInput from "../../shared/RadioInput";
import { SystemPalette as SystemPaletteType } from "../../types";
import styles from "./EditorSidebar.module.scss";
import PaletteToolbar from "./PaletteToolbar";
import PaletteToolbarColorInput from "./PaletteToolbarColorInput";
import Section from "./Section";

type Props = {
  systemPalettes: Array<SystemPaletteType>;
  systemPalette: SystemPaletteType;
  onSystemPaletteChange: (id: SystemPaletteType["id"]) => void;
  backgroundPalettes: Array<GamePaletteWithColors>;
  spritePalettes: Array<GamePaletteWithColors>;
  onGamePaletteChange: (gamePaletteChange: GamePaletteChange) => void;
};

const EditorSidebar: React.FunctionComponent<Props> = ({
  systemPalettes,
  systemPalette,
  onSystemPaletteChange,
  backgroundPalettes,
  spritePalettes,
  onGamePaletteChange
}) => (
  <div className={styles.sidebar}>
    <Section>
      <header>
        <h1>System Palette</h1>
      </header>
      <RadioInput.Group
        legend="System palette to use:"
        options={systemPalettes}
        selectedId={systemPalette.id}
        onChange={onSystemPaletteChange}
      />
    </Section>
    <Section>
      <header>
        <h1>Game Palettes</h1>
      </header>
      <h2>Background Color</h2>
      <div className={styles.palette}>
        <Panel>
          <PaletteColorInput
            color={backgroundPalettes[0].colors[0]}
            systemPalette={systemPalette}
            onChange={color =>
              onGamePaletteChange({
                gamePalette: backgroundPalettes[0],
                valueIndex: 0,
                newColor: color
              })
            }
          />
        </Panel>
      </div>
      <h2>Background Palettes</h2>
      {backgroundPalettes.map(palette => (
        <div key={palette.id} className={styles.palette}>
          <h3>
            <span className="screen-reader-only">Background palette </span>#
            {palette.id}
          </h3>
          <PaletteToolbar ariaLabel="Color edit toolbar">
            {tail(palette.colors).map((color, index) => (
              <PaletteToolbarColorInput
                key={index}
                index={index}
                color={color}
                systemPalette={systemPalette}
                onChange={color =>
                  onGamePaletteChange({
                    gamePalette: palette,
                    valueIndex: index + 1,
                    newColor: color
                  })
                }
              />
            ))}
          </PaletteToolbar>
        </div>
      ))}
      <h2>Sprite Palettes</h2>
      {spritePalettes.map(palette => (
        <div key={palette.id} className={styles.palette}>
          <h3>
            <span className="screen-reader-only">Sprite palette </span>#
            {palette.id}
          </h3>
          <PaletteToolbar ariaLabel="Color edit toolbar">
            {tail(palette.colors).map((color, index) => (
              <PaletteToolbarColorInput
                key={index}
                index={index}
                color={color}
                systemPalette={systemPalette}
                onChange={color =>
                  onGamePaletteChange({
                    gamePalette: palette,
                    valueIndex: index + 1,
                    newColor: color
                  })
                }
              />
            ))}
          </PaletteToolbar>
        </div>
      ))}
    </Section>
  </div>
);

export default EditorSidebar;
