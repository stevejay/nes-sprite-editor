import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { includes } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import { WordCloudNode } from "../types";
import WordCloud from "../WordCloud";
import generateWordCloudNodes from "./words";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const store = new Store<{
  data: Array<WordCloudNode>;
  selectedNodeIds: Array<string>;
}>({
  data: generateWordCloudNodes(100),
  selectedNodeIds: []
});

storiesOf("SE_OLD/WordCloud", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => store.set({ data: generateWordCloudNodes(100) })}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <WordCloud
              nodes={state.data}
              selectedNodeIds={state.selectedNodeIds}
              onNodeClick={value => {
                let newSelectedIds = state.selectedNodeIds.slice();
                if (includes(newSelectedIds, value.id)) {
                  newSelectedIds = newSelectedIds.filter(x => x !== value.id);
                } else {
                  newSelectedIds.push(value.id);
                }
                store.set({
                  selectedNodeIds: newSelectedIds
                });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
