import React from "react";
import SelectInput from "../../shared/SelectInput";
import { PatternTable, PatternTableType } from "../../types";
import { Action, ActionTypes } from "../../reducer";

type Props = {
  type: PatternTableType;
  patternTables: Array<PatternTable>;
  currentTable: PatternTable | null;
  dispatch: React.Dispatch<Action>;
};

const PatternTableSelector: React.FunctionComponent<Props> = ({
  type,
  patternTables,
  currentTable,
  dispatch
}) => (
  <SelectInput<string>
    options={patternTables}
    value={currentTable ? currentTable.id : null}
    onChange={id =>
      dispatch({
        type: ActionTypes.SELECT_PATTERN_TABLE,
        payload: { type, id }
      })
    }
  />
);

export default PatternTableSelector;
