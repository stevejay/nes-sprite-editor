import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { sampleSize } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import CommsDataSource from "../CommsDataSource";
import generateWordCloudNodes from "./words";
import { CommsSource } from "..";

const SOURCES = [
  { id: "bloomberg-chat", name: "Bloomberg Chat" },
  { id: "exchange", name: "Exchange" },
  { id: "eikon-chat", name: "EIKON Chat" },
  { id: "ice-chat", name: "ICE Chat" },
  { id: "symphony", name: "Symphony" },
  { id: "foo", name: "Foo" },
  { id: "bar", name: "Bar" }
];

function createSourcesData() {
  return sampleSize(SOURCES, 4).map(source => {
    return {
      ...source,
      nodes: generateWordCloudNodes(100)
    } as CommsSource;
  });
}

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const store = new Store<{
  sources: any;
  selectedIds: Array<string>;
}>({
  sources: createSourcesData(),
  selectedIds: []
});

storiesOf("SE/CommsDataSource", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => {
          store.set({ sources: createSourcesData() });
        }}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <CommsDataSource
              sources={state.sources}
              // nodes={state.data.nodes}
              // links={state.data.links}
              // selectedIds={state.selectedIds}
              // onNodeClick={value => {
              //   let newSelectedIds = state.selectedIds.slice();
              //   if (includes(newSelectedIds, value)) {
              //     newSelectedIds = newSelectedIds.filter(x => x !== value);
              //   } else {
              //     newSelectedIds.push(value);
              //   }
              //   store.set({
              //     selectedIds: newSelectedIds
              //   });
              // }}
            />
          )}
        </State>
      </div>
    </div>
  ));
