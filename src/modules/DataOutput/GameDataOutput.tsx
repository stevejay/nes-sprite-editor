import React from "react";
import {
  selectCurrentBackgroundPalettes,
  selectCurrentSpritePalettes,
  selectCurrentBackgroundPatternTable
} from "../../contexts/editor";
import Button from "../../shared/Button";
import CodePanel from "./CodePanel";
import downloadPatternTable from "./download-pattern-table";
import useGameDataText from "./use-game-text";
import { useEditorContext } from "../../contexts/editor";

const GameDataOutput = () => {
  const [state] = useEditorContext();
  const backgroundPalettes = selectCurrentBackgroundPalettes(state);
  const spritePalettes = selectCurrentSpritePalettes(state);
  const backgroundPatternTable = selectCurrentBackgroundPatternTable(state);

  const [gameDataText, updateGameDataText] = useGameDataText(
    backgroundPalettes,
    spritePalettes
  );

  const dom = React.useMemo(
    () => (
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
    ),
    [gameDataText]
  );

  return dom;

  // return (
  //   <section>
  //     <header>
  //       <h1>ASM Output</h1>
  //     </header>
  //     <Button.Container>
  //       <Button onClick={updateGameDataText}>Update text output</Button>
  //       <Button
  //         disabled={!backgroundPatternTable}
  //         onClick={() => downloadPatternTable(backgroundPatternTable)}
  //       >
  //         Download background tiles pattern file
  //       </Button>
  //     </Button.Container>
  //     <CodePanel>{gameDataText}</CodePanel>
  //   </section>
  // );
};

export default GameDataOutput;
