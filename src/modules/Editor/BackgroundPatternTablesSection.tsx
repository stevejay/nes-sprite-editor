import React from "react";
import {
  selectCurrentBackgroundPalettes,
  useEditorContext,
  selectBackgroundPatternTables,
  selectCurrentBackgroundPatternTable,
  ActionTypes
} from "../../contexts/editor";
import PatternTable from "./PatternTable";
import Section from "./Section";
import EntityManagementToolbar from "../../shared/EntityManagementToolbar";

const BackgroundPatternTablesSection = () => {
  const [state, dispatch] = useEditorContext();
  const patternTables = selectBackgroundPatternTables(state);
  const patternTable = selectCurrentBackgroundPatternTable(state);
  const paletteCollection = selectCurrentBackgroundPalettes(state);

  // TODO move down into PatternTable?
  const [currentTile, setCurrentTile] = React.useState({ row: 0, column: 0 });

  return (
    <Section>
      <header>
        <h2>Background Pattern Tables</h2>
      </header>
      <h3>Current Pattern Table</h3>
      <EntityManagementToolbar
        entities={patternTables}
        currentEntity={patternTable}
        entityName="Pattern Table"
        onSelected={id =>
          dispatch({
            type: ActionTypes.SELECT_PATTERN_TABLE,
            payload: { type: "background", id }
          })
        }
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
        patternTable={patternTable}
        paletteCollection={paletteCollection}
        currentTile={currentTile}
        onSelectTile={(row, column) => setCurrentTile({ row, column })}
      />
    </Section>
  );
};

export default BackgroundPatternTablesSection;
