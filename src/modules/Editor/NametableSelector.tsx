import React from "react";
import SelectInput from "../../shared/SelectInput";
import { Action, ActionTypes } from "../../reducer";
import { Nametable } from "../../types";

type Props = {
  nametables: Array<Nametable>;
  currentNametable: Nametable | null;
  dispatch: React.Dispatch<Action>;
};

const NametableSelector: React.FunctionComponent<Props> = ({
  nametables,
  currentNametable,
  dispatch
}) => (
  <SelectInput<string>
    options={nametables}
    value={currentNametable ? currentNametable.id : null}
    onChange={id =>
      dispatch({
        type: ActionTypes.SELECT_NAMETABLE,
        payload: { id }
      })
    }
  />
);

export default NametableSelector;
