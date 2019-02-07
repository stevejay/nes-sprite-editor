import React from "react";
import {
  Action,
  ActionTypes,
  GamePaletteCollectionWithColors
} from "../../reducer";
import { PatternTable as PatternTableType } from "../../types";
import PatternTable from "./PatternTable";
import EntityManagement from "./EntityManagement";
import Section from "./Section";

type Props = {
  patternTables: Array<PatternTableType>;
  currentTable: PatternTableType | null;
  currentPaletteCollection: GamePaletteCollectionWithColors | null;
  dispatch: React.Dispatch<Action>;
};

const BackgroundPatternTablesSection = ({
  patternTables,
  currentTable,
  currentPaletteCollection,
  dispatch
}: Props) => {
  // TODO move down into PatternTable?
  const [currentTile, setCurrentTile] = React.useState({ row: 0, column: 0 });

  return (
    <Section>
      <header>
        <h2>Background Pattern Tables</h2>
      </header>
      <h3>Current Pattern Table</h3>
      <EntityManagement.Selector
        entities={patternTables}
        currentEntity={currentTable}
        onChange={id =>
          dispatch({
            type: ActionTypes.SELECT_PATTERN_TABLE,
            payload: { type: "background", id }
          })
        }
      />
      <EntityManagement.Toolbar
        entities={patternTables}
        currentEntity={currentTable}
        entityName="Pattern Table"
        onNewEntity={() =>
          dispatch({
            type: ActionTypes.ADD_NEW_PATTERN_TABLE,
            payload: { type: "background", label: "New pattern table" }
          })
        }
        onCopyEntity={id =>
          dispatch({
            type: ActionTypes.COPY_PATTERN_TABLE,
            payload: { type: "background", id }
          })
        }
        onDeleteEntity={id =>
          dispatch({
            type: ActionTypes.DELETE_PATTERN_TABLE,
            payload: { type: "background", id }
          })
        }
        onRenameEntity={(id, label) =>
          dispatch({
            type: ActionTypes.UPDATE_PATTERN_TABLE_METADATA,
            payload: { type: "background", id, label }
          })
        }
      />
      <h3>Pattern Table Tiles</h3>
      <PatternTable
        scale={3}
        patternTable={currentTable}
        paletteCollection={currentPaletteCollection}
        currentTile={currentTile}
        onSelectTile={(row, column) => setCurrentTile({ row, column })}
      />
    </Section>
  );
};

export default BackgroundPatternTablesSection;
