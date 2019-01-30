import * as React from "react";
import { host } from "storybook-host";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import { PointingModalContainer, ModalDialog } from "..";
import { range } from "lodash";
import Button from "../../Button/Button";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent",
  width: "100%",
  height: "100%"
});

const store = new Store({
  isOpen: false
});

storiesOf("Modal", module)
  .addDecorator(storyHost)
  .add("PointingModalContainer", () => (
    <PointingModalContainer originElement={null} originX={50} originY={100}>
      <div>
        Some content
        <br />
        in a modal
      </div>
    </PointingModalContainer>
  ))
  .add("ModalDialog - Short", () => (
    <State store={store}>
      {state => (
        <>
          <button onClick={() => store.set({ isOpen: true })}>
            Open Dialog
          </button>
          <ModalDialog
            isOpen={state.isOpen}
            onClose={() => store.set({ isOpen: false })}
          >
            <ModalDialog.Header onClose={() => store.set({ isOpen: false })}>
              Some modal title
            </ModalDialog.Header>
            <ModalDialog.Content>
              <p>Some content in a modal.</p>
            </ModalDialog.Content>
            <ModalDialog.Footer>
              <Button
                color="primary"
                onClick={() => store.set({ isOpen: false })}
              >
                Done
              </Button>
            </ModalDialog.Footer>
          </ModalDialog>
        </>
      )}
    </State>
  ))
  .add("ModalDialog - Long", () => (
    <State store={store}>
      {state => (
        <>
          <button onClick={() => store.set({ isOpen: true })}>
            Open Dialog
          </button>
          {range(0, 50).map(index => (
            <p key={index}>Body content</p>
          ))}
          <ModalDialog
            isOpen={state.isOpen}
            onClose={() => store.set({ isOpen: false })}
          >
            <a href="#">Focus should start here</a>
            <p>
              A very long line in this modal that goes on a long time and goes
              on a long time and goes on a long time and goes on a long time.
            </p>
            {range(0, 300).map(index => (
              <p key={index}>Some content in a modal.</p>
            ))}
            <button onClick={() => store.set({ isOpen: false })}>Done</button>
          </ModalDialog>
        </>
      )}
    </State>
  ));
