import React from "react";
import { connect } from "react-redux";
import Button from "../../../../shared/Button";
import Section from "../../../../shared/Section";
import {
  EditorStateSlice,
  exportCurrentState,
  GamePaletteCollectionWithColors,
  Nametable as NametableType,
  PatternTable,
  selectCurrentBackgroundPaletteCollection,
  selectCurrentBackgroundPatternTable,
  selectCurrentNametable
} from "../../store";

type Props = {
  nametable: NametableType | null;
  patternTable: PatternTable | null;
  paletteCollection: GamePaletteCollectionWithColors | null;
  exportCurrentState: any; // typeof exportCurrentState; // can I fix this?
};

const ExportsSection = ({
  nametable,
  patternTable,
  paletteCollection,
  exportCurrentState
}: Props) => {
  const cannotExport = !nametable || !patternTable || !paletteCollection;
  return (
    <Section>
      <header>
        <h2>Exports</h2>
      </header>
      <Button
        appearance="primary"
        onClick={exportCurrentState}
        disabled={cannotExport}
      >
        Export current state as files for NES
      </Button>
    </Section>
  );
};

export default connect(
  (state: EditorStateSlice) => ({
    nametable: selectCurrentNametable(state),
    patternTable: selectCurrentBackgroundPatternTable(state),
    paletteCollection: selectCurrentBackgroundPaletteCollection(state)
  }),
  {
    exportCurrentState
  }
)(ExportsSection);
