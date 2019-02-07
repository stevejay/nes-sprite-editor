import React from "react";
import Nametable from "./Nametable";
import Section from "./Section";
import EntityManagement from "./EntityManagement";
import {
  useEditorContext,
  selectNametables,
  selectCurrentNametable,
  selectCurrentBackgroundPatternTable,
  selectCurrentBackgroundPalettes,
  ActionTypes
} from "../../contexts/editor";

const NametablesSection = () => {
  const [state, dispatch] = useEditorContext();
  const nametables = selectNametables(state);
  const currentNametable = selectCurrentNametable(state);
  const patternTable = selectCurrentBackgroundPatternTable(state);
  const paletteCollection = selectCurrentBackgroundPalettes(state);

  return (
    <Section>
      <header>
        <h2>Nametables</h2>
      </header>
      <h3>Current Nametable</h3>
      <EntityManagement.Selector
        entities={nametables}
        currentEntity={currentNametable}
        onChange={id =>
          dispatch({
            type: ActionTypes.SELECT_NAMETABLE,
            payload: { id }
          })
        }
      />
      <EntityManagement.Toolbar
        entities={nametables}
        currentEntity={currentNametable}
        entityName="Nametable"
        onNewEntity={() =>
          dispatch({
            type: ActionTypes.ADD_NEW_NAMETABLE,
            payload: { label: "New nametable" }
          })
        }
        onCopyEntity={id =>
          dispatch({
            type: ActionTypes.COPY_NAMETABLE,
            payload: { id }
          })
        }
        onDeleteEntity={id =>
          dispatch({
            type: ActionTypes.DELETE_NAMETABLE,
            payload: { id }
          })
        }
        onRenameEntity={(id, label) =>
          dispatch({
            type: ActionTypes.UPDATE_NAMETABLE_METADATA,
            payload: { id, label }
          })
        }
      />
      <h3>Nametable Tiles</h3>
      <Nametable
        nametable={currentNametable}
        patternTable={patternTable}
        paletteCollection={paletteCollection}
        dispatch={dispatch}
      />
    </Section>
  );
};

export default NametablesSection;
