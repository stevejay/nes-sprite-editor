import { RovingTabIndexProvider, useRovingTabIndex } from "..";
import { storiesOf } from "@storybook/react";
import { State, Store } from "@sambego/storybook-state";
import * as React from "react";
import { host } from "storybook-host";
import "../../../index.scss";
import useFocusEffect from "../../utils/use-focus-effect";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  buttonDisabled: false
});

type Props = {
  disabled?: boolean;
  children: React.ReactNode;
};

const ToolbarButton = ({ disabled = false, children }: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [tabIndex, focused, onKeyDown, onClick] = useRovingTabIndex(
    buttonRef,
    disabled
  );
  useFocusEffect(focused, buttonRef);
  return (
    <button
      ref={buttonRef}
      tabIndex={tabIndex}
      disabled={disabled}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Wrapper = () => (
  <span>
    <ToolbarButton>Second Option</ToolbarButton>
  </span>
);

storiesOf("RovingTabIndex", module)
  .addDecorator(storyHost)
  .add("Basic", () => (
    <div style={{ padding: 30 }}>
      <button>Before</button>
      <RovingTabIndexProvider>
        <ToolbarButton>First Option</ToolbarButton>
        <Wrapper />
        <ToolbarButton>Third Option</ToolbarButton>
      </RovingTabIndexProvider>
      <button>After</button>
    </div>
  ))
  .add("Disabled Options", () => (
    <State store={store}>
      {state => (
        <div style={{ padding: 30 }}>
          <button
            onClick={() => store.set({ buttonDisabled: !state.buttonDisabled })}
          >
            Disable button
          </button>
          <RovingTabIndexProvider>
            <ToolbarButton>First Option</ToolbarButton>
            <span>
              <ToolbarButton disabled={state.buttonDisabled}>
                Second Option
              </ToolbarButton>
            </span>
            <ToolbarButton>Third Option</ToolbarButton>
          </RovingTabIndexProvider>
          <button>After</button>
        </div>
      )}
    </State>
  ));
