import React from "react";
import styles from "./Editor.module.scss";
import EditorSidebar from "./EditorSidebar";
import {
  Action,
  ActionTypes,
  selectBackgroundColor,
  selectBackgroundPalettes,
  selectSpritePalettes,
  selectSystemPalette,
  selectSystemPalettes,
  State,
  selectCurrentBackgroundTileGrid,
  selectBackgroundTileGridScaling,
  selectSelectedBackgroundTile,
  selectSelectedBackgroundTiles
} from "../../reducer";
import Section from "./Section";
import BackgroundPatternTable from "./BackgroundPatternTable";
import BackgroundPatternDetail from "./BackgroundPatternDetail";

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FunctionComponent<Props> = ({ state, dispatch }) => {
  const tileGrid = selectCurrentBackgroundTileGrid(state);

  return (
    <div className={styles.container}>
      <EditorSidebar
        systemPalettes={selectSystemPalettes(state)}
        systemPalette={selectSystemPalette(state)}
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
          metatileSize={2}
          scaling={selectBackgroundTileGridScaling(state)}
          tiles={tileGrid.tiles}
          selectedMetatile={selectSelectedBackgroundTile(state)}
          backgroundColor={selectBackgroundColor(state)}
          palettes={selectBackgroundPalettes(state)}
          onSelectedMetatileChange={selected =>
            dispatch({
              type: ActionTypes.CHANGE_SELECTED_BACKGROUND_TILE,
              payload: selected
            })
          }
        />
        <h2>Selected Metatile</h2>
        <BackgroundPatternDetail
          tilesInRow={2}
          tilesInColumn={2}
          scaling={20}
          tiles={selectSelectedBackgroundTiles(state)}
          selectedMetatile={selectSelectedBackgroundTile(state)}
          backgroundColor={selectBackgroundColor(state)}
          palettes={selectBackgroundPalettes(state)}
        />
      </Section>
    </div>
  );
};

export default Editor;
