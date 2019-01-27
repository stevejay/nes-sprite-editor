import React from "react";
import styles from "./Editor.module.scss";
import EditorSidebar from "./EditorSidebar";
import {
  Action,
  ActionTypes,
  selectBackgroundPalettes,
  selectSpritePalettes,
  selectCurrentSystemPalette,
  selectSystemPalettes,
  State,
  selectCurrentBackgroundPatternTable,
  selectCurrentBackgroundMetatile,
  selectCurrentBackgroundMetatileTiles,
  selectCurrentBackgroundMetatilePalette
} from "../../reducer";
import Section from "./Section";
import BackgroundPatternTable from "./BackgroundPatternTable";
import BackgroundPatternDetail from "./BackgroundPatternDetail";
import RadioInput from "../../shared/RadioInput";

const PALETTE_OPTIONS = [
  { id: 0, label: "#0" },
  { id: 1, label: "#1" },
  { id: 2, label: "#2" },
  { id: 3, label: "#3" }
];

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FunctionComponent<Props> = ({ state, dispatch }) => {
  const patternTable = selectCurrentBackgroundPatternTable(state);
  const currentMetatilePalette = selectCurrentBackgroundMetatilePalette(state);
  const [drawColorIndex, setDrawColorIndex] = React.useState(0);

  const colorOptions = React.useMemo(
    () => {
      return currentMetatilePalette!.colors.map((color, index) => ({
        id: index,
        label: `${color.id}`
      }));
    },
    [currentMetatilePalette]
  );

  return (
    <div className={styles.container}>
      <EditorSidebar
        systemPalettes={selectSystemPalettes(state)}
        systemPalette={selectCurrentSystemPalette(state)}
        onSystemPaletteChange={id =>
          dispatch({
            type: ActionTypes.CHANGE_SYSTEM_PALETTE,
            payload: id
          })
        }
        backgroundPalettes={selectBackgroundPalettes(state)}
        spritePalettes={selectSpritePalettes(state)}
        onGamePaletteChange={gamePaletteChange =>
          dispatch({
            type: ActionTypes.CHANGE_GAME_PALETTE_COLOR,
            payload: gamePaletteChange
          })
        }
      />
      <Section>
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
      </Section>
    </div>
  );
};

export default Editor;
