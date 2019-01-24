import { noop } from "lodash";
import React from "react";

type Context = {
  state: {
    selectedIndex: number;
    lastActionOrigin: "mouse" | "keyboard";
  };
  tabPrev: () => void;
  tabNext: () => void;
  clicked: (index: number) => void;
};

export const RovingTabIndexContext = React.createContext<Context>({
  state: {
    selectedIndex: -1,
    lastActionOrigin: "mouse"
  },
  tabPrev: noop,
  tabNext: noop,
  clicked: noop
});

type ProviderProps = {
  children: React.ReactNode;
};

const Provider: React.FunctionComponent<ProviderProps> = ({ children }) => {
  const [state, updateState] = React.useState<Context["state"]>({
    selectedIndex: 0,
    lastActionOrigin: "mouse"
  });

  const contextValue = React.useMemo<Context>(
    () => ({
      state,
      tabPrev: () => {
        const newSelectedIndex = state.selectedIndex - 1;
        updateState({
          lastActionOrigin: "keyboard",
          selectedIndex:
            newSelectedIndex < 0
              ? React.Children.count(children) - 1
              : newSelectedIndex
        });
      },
      tabNext: () => {
        const newSelectedIndex = state.selectedIndex + 1;
        updateState({
          lastActionOrigin: "keyboard",
          selectedIndex:
            newSelectedIndex >= React.Children.count(children)
              ? 0
              : newSelectedIndex
        });
      },
      clicked: index => {
        updateState({
          lastActionOrigin: "mouse",
          selectedIndex: index
        });
      }
    }),
    [state]
  );

  return (
    <RovingTabIndexContext.Provider value={contextValue}>
      {children}
    </RovingTabIndexContext.Provider>
  );
};

export default Provider;
