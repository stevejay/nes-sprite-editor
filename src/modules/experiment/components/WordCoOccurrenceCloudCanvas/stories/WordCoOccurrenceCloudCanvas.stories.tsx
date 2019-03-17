import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { includes, noop } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import { WordCloudNode } from "../../WordCloudCanvasChart";
import WordCoOccurrenceCloudCanvas from "../WordCoOccurrenceCloudCanvas";
import generateWordCloudNodes from "./words";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const store = new Store<{
  nodes: Array<WordCloudNode>;
  selectedNodeIds: Array<string>;
  withNodes: Array<WordCloudNode>;
  selectedWithNodeIds: Array<string>;
}>({
  nodes: generateWordCloudNodes(100),
  selectedNodeIds: [],
  withNodes: [],
  selectedWithNodeIds: []
});

storiesOf("SE/WordCoOccurrenceCloudCanvas", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() =>
          store.set({
            nodes: generateWordCloudNodes(100),
            withNodes: [],
            selectedWithNodeIds: []
          })
        }
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <WordCoOccurrenceCloudCanvas
              nodes={state.nodes}
              selectedNodeIds={state.selectedNodeIds}
              withNodes={state.withNodes}
              selectedWithNodeIds={state.selectedWithNodeIds}
              onNodeClick={value => {
                let newSelectedIds = state.selectedNodeIds.slice();
                if (includes(newSelectedIds, value.id)) {
                  newSelectedIds = newSelectedIds.filter(x => x !== value.id);
                } else {
                  newSelectedIds.push(value.id);
                }
                const newLength = newSelectedIds.length;
                store.set({
                  selectedNodeIds: newSelectedIds,
                  withNodes: newLength === 0 ? [] : generateWordCloudNodes(100),
                  selectedWithNodeIds:
                    newLength === 0 ? [] : state.selectedWithNodeIds
                });
              }}
              onWithNodeClick={value => {
                let newSelectedIds = state.selectedWithNodeIds.slice();
                if (includes(newSelectedIds, value.id)) {
                  newSelectedIds = newSelectedIds.filter(x => x !== value.id);
                } else {
                  newSelectedIds.push(value.id);
                }
                store.set({
                  selectedWithNodeIds: newSelectedIds
                });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
