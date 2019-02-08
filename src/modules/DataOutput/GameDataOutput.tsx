import React from "react";
import Button from "../../shared/Button";
import CodePanel from "./CodePanel";
import downloadPatternTable from "./download-pattern-table";
import useGameDataText from "./use-game-text";
import {
  EditorStateSlice,
  selectCurrentBackgroundPalettes,
  selectCurrentSpritePalettes,
  selectCurrentBackgroundPatternTable
} from "../Editor/redux";
import { connect } from "react-redux";
import { GamePaletteCollectionWithColors, PatternTable } from "../../types";

type Props = {
  backgroundPalettes: GamePaletteCollectionWithColors | null;
  spritePalettes: GamePaletteCollectionWithColors | null;
  backgroundPatternTable: PatternTable | null;
};
const GameDataOutput = ({
  backgroundPalettes,
  spritePalettes,
  backgroundPatternTable
}: Props) => {
  const [gameDataText, updateGameDataText] = useGameDataText(
    backgroundPalettes,
    spritePalettes
  );

  // const dom = React.useMemo(
  //   () => (
  //     <section>
  //       <header>
  //         <h1>ASM Output</h1>
  //       </header>
  //       <Button.Container>
  //         <Button onClick={updateGameDataText}>Update text output</Button>
  //         <Button
  //           disabled={!backgroundPatternTable}
  //           onClick={() => downloadPatternTable(backgroundPatternTable)}
  //         >
  //           Download background tiles pattern file
  //         </Button>
  //       </Button.Container>
  //       <CodePanel>{gameDataText}</CodePanel>
  //     </section>
  //   ),
  //   [gameDataText]
  // );

  // return dom;

  return (
    <section>
      <header>
        <h1>ASM Output</h1>
      </header>
      <Button.Container>
        <Button onClick={updateGameDataText}>Update text output</Button>
        <Button
          disabled={!backgroundPatternTable}
          onClick={() => downloadPatternTable(backgroundPatternTable)}
        >
          Download background tiles pattern file
        </Button>
      </Button.Container>
      <CodePanel>{gameDataText}</CodePanel>
    </section>
  );
};

export default connect(
  (state: EditorStateSlice) => ({
    backgroundPalettes: selectCurrentBackgroundPalettes(state),
    spritePalettes: selectCurrentSpritePalettes(state),
    backgroundPatternTable: selectCurrentBackgroundPatternTable(state)
  }),
  {}
)(GameDataOutput);
