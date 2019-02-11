import { noop, findIndex, isEmpty, findLastIndex } from "lodash";
import React from "react";

const DOCUMENT_POSITION_FOLLOWING = 4;

type TabStop = {
  id: string;
  domElementRef: React.RefObject<any>;
};

type State = {
  selectedId: string | null;
  lastActionOrigin: "mouse" | "keyboard";
  tabStops: Array<TabStop>;
};

export enum ActionTypes {
  REGISTER = "REGISTER",
  UNREGISTER = "UNREGISTER",
  TAB_TO_PREVIOUS = "TAB_TO_PREVIOUS",
  TAB_TO_NEXT = "TAB_TO_NEXT",
  CLICKED = "CLICKED"
}

type Action =
  | {
      type: ActionTypes.REGISTER;
      payload: TabStop;
    }
  | {
      type: ActionTypes.UNREGISTER;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.TAB_TO_PREVIOUS;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.TAB_TO_NEXT;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.CLICKED;
      payload: { id: TabStop["id"] };
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER: {
      const newTabStop = action.payload;
      if (isEmpty(state.tabStops)) {
        return {
          ...state,
          selectedId: newTabStop.id,
          tabStops: [newTabStop]
        };
      }
      const index = findIndex(
        state.tabStops,
        tabStop => tabStop.id === newTabStop.id
      );
      if (index >= 0) {
        // already registered (should never happen)
        return state;
      }
      const indexBefore = findLastIndex(
        state.tabStops,
        tabStop =>
          !!(
            tabStop.domElementRef.current.compareDocumentPosition(
              newTabStop.domElementRef.current
            ) & DOCUMENT_POSITION_FOLLOWING
          )
      );
      return {
        ...state,
        tabStops: [
          ...state.tabStops.slice(0, indexBefore + 1),
          newTabStop,
          ...state.tabStops.slice(indexBefore + 1)
        ]
      };
    }
    case ActionTypes.UNREGISTER: {
      const id = action.payload.id;
      const tabStops = state.tabStops.filter(tabStop => tabStop.id !== id);
      if (tabStops.length === state.tabStops.length) {
        // Already unregistered (should never happen)
        return state;
      }
      return {
        ...state,
        selectedId:
          state.selectedId === id
            ? isEmpty(tabStops)
              ? null
              : tabStops[0].id
            : state.selectedId,
        tabStops
      };
    }
    case ActionTypes.TAB_TO_PREVIOUS:
    case ActionTypes.TAB_TO_NEXT: {
      const id = action.payload.id;
      const index = findIndex(state.tabStops, tabStop => tabStop.id === id);
      if (index === -1) {
        // unregistered (should never happen)
        return state;
      }
      const newIndex =
        action.type === ActionTypes.TAB_TO_PREVIOUS
          ? index <= 0
            ? state.tabStops.length - 1
            : index - 1
          : index >= state.tabStops.length - 1
          ? 0
          : index + 1;
      return {
        ...state,
        lastActionOrigin: "keyboard",
        selectedId: state.tabStops[newIndex].id
      };
    }
    case ActionTypes.CLICKED: {
      return {
        ...state,
        lastActionOrigin: "mouse",
        selectedId: action.payload.id
      };
    }
    default:
      return state;
  }
}

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const RovingTabIndexContext = React.createContext<Context>({
  state: {
    selectedId: null,
    lastActionOrigin: "mouse",
    tabStops: []
  },
  dispatch: noop
});

type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props) => {
  const [state, dispatch] = React.useReducer(reducer, {
    selectedId: null,
    lastActionOrigin: "mouse",
    tabStops: []
  });

  const context = React.useMemo<Context>(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return (
    <RovingTabIndexContext.Provider value={context}>
      {children}
    </RovingTabIndexContext.Provider>
  );
};

export default Provider;
