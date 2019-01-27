import React from "react";
import styles from "./Editor.module.scss";
import EditorSidebar from "./EditorSidebar";
import {
  Action,
  ActionTypes,
  selectBackgroundColor,
  selectBackgroundPalettes,
  selectSpritePalettes,
  selectCurrentSystemPalette,
  selectSystemPalettes,
  State,
  selectCurrentBackgroundPatternTable,
  selectBackgroundPatternTableScaling,
  selectCurrentBackgroundMetatile,
  selectCurrentBackgroundMetatileTiles
} from "../../reducer";
import Section from "./Section";
import BackgroundPatternTable from "./BackgroundPatternTable";
import BackgroundPatternDetail from "./BackgroundPatternDetail";
import RadioInput from "../../shared/RadioInput";

const PALETTE_OPTIONS = [
  { id: "0", label: "#0" },
  { id: "1", label: "#1" },
  { id: "2", label: "#2" },
  { id: "3", label: "#3" }
];

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FunctionComponent<Props> = ({ state, dispatch }) => {
  const tileGrid = selectCurrentBackgroundPatternTable(state);

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
        backgroundColor={selectBackgroundColor(state)}
        onBackgroundColorChange={color =>
          dispatch({
            type: ActionTypes.CHANGE_BACKGROUND_COLOR,
            payload: color.id
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
          scaling={selectBackgroundPatternTableScaling(state)}
          tiles={tileGrid.tiles}
          currentMetatile={selectCurrentBackgroundMetatile(state)}
          backgroundColor={selectBackgroundColor(state)}
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
          backgroundColor={selectBackgroundColor(state)}
          palettes={selectBackgroundPalettes(state)}
        />
        <RadioInput.Group
          legend="Palette:"
          options={PALETTE_OPTIONS}
          selectedId={
            selectCurrentBackgroundMetatileTiles(state)[0].gamePaletteId + ""
          }
          onChange={id => {
            dispatch({
              type: ActionTypes.CHANGE_CURRENT_BACKGROUND_METATILE_PALETTE,
              payload: parseInt(id, 10)
            });
          }}
          inline={false}
        />
      </Section>
    </div>
  );
};

export default Editor;
