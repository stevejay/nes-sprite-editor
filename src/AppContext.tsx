import React from "react";
import { noop } from "lodash";
import { initialState, reducer, State, Action } from "./reducer";

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

type ProviderProps = {
  children: React.ReactNode;
};

const Context = React.createContext<Context>({
  state: initialState,
  dispatch: noop
});

export function Provider({ children }: ProviderProps) {
  const [state, dispatch] = React.useReducer<State, Action>(
    reducer,
    initialState
  );

  const context = React.useMemo<Context>(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function useAppContext() {
  const context = React.useContext(Context);
  return [context.state, context.dispatch];
}
