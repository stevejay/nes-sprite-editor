import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { sampleSize, includes, flatten, sortBy, reverse } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import CommsDataSource from "../CommsDataSourceC";
import generateWordCloudNodes from "./words";
import { CommsSourceNode } from "..";

const SOURCES = [
  { id: "bloomberg-chat", name: "Bloomberg Chat" },
  { id: "exchange", name: "Exchange" },
  { id: "eikon-chat", name: "EIKON Chat" },
  { id: "ice-chat", name: "ICE Chat" },
  { id: "symphony", name: "Symphony" },
  { id: "foo", name: "Foo" },
  { id: "bar", name: "Bar" },
  { id: "bat", name: "Bat" }
];

function createNodeData(): Array<CommsSourceNode> {
  let result = flatten(
    sampleSize(SOURCES, 4).map(source =>
      generateWordCloudNodes(source.id, source.name, 150)
    )
  );

  result = reverse(sortBy(result, node => node.value));

  return result;
}

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const store = new Store<{
  nodes: Array<CommsSourceNode>;
  selectedNodeIds: Array<string>;
}>({
  nodes: createNodeData(),
  selectedNodeIds: []
});

storiesOf("SE/CommsDataSourceCanvas", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => {
          store.set({ nodes: createNodeData() });
        }}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <CommsDataSource
              nodes={state.nodes}
              selectedNodeIds={state.selectedNodeIds}
              onNodeClick={value => {
                let newSelectedNodeIds = state.selectedNodeIds.slice();
                if (includes(newSelectedNodeIds, value)) {
                  newSelectedNodeIds = newSelectedNodeIds.filter(
                    x => x !== value
                  );
                } else {
                  newSelectedNodeIds.push(value);
                }
                store.set({
                  selectedNodeIds: newSelectedNodeIds
                });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
