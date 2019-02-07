import React from "react";
import { noop } from "lodash";
import { initialState, reducer } from "./reducer";
import { State, Action } from "./types";

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const Context = React.createContext<Context>({
  state: initialState,
  dispatch: noop
});

type ProviderProps = {
  children: React.ReactNode;
};

export function EditorContextProvider({ children }: ProviderProps) {
  const [state, dispatch] = React.useReducer<State, Action>(
    reducer,
    initialState
  );

  const value = React.useMemo<Context>(() => ({ state, dispatch }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useEditorContext(): [Context["state"], Context["dispatch"]] {
  const context = React.useContext(Context);
  return [context.state, context.dispatch];
}
