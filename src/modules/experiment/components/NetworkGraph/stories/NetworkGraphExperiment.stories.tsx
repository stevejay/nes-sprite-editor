import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { cloneDeep, includes } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import { Node, Link } from "../NetworkGraph";
import { default as NetworkGraphExperiment } from "../NetworkGraphExperiment";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const NODES: Array<Node> = [
  { id: 0, initials: "JS", type: "account", isRoot: true },
  { id: 1, initials: "ZB", type: "account", degree: 1 },
  { id: 2, initials: "DC", type: "account", degree: 1 },
  { id: 3, initials: "TD", type: "account", degree: 1 },
  { id: 4, initials: "SS", type: "market", degree: 1 },
  { id: 5, initials: "MS", type: "market", degree: 1 },

  { id: 6, initials: "AA", type: "account", degree: 2 },
  { id: 7, initials: "BB", type: "account", degree: 2 },
  { id: 8, initials: "BC", type: "account", degree: 3 },
  { id: 9, initials: "BD", type: "account", degree: 3 },
  { id: 10, initials: "BE", type: "account", degree: 3 },

  { id: 11, initials: "CA", type: "market", degree: 2 },
  { id: 12, initials: "CB", type: "market", degree: 2 },
  { id: 13, initials: "CC", type: "account", degree: 2 },
  { id: 14, initials: "CD", type: "account", degree: 3 },
  { id: 15, initials: "CE", type: "account", degree: 3 },
  { id: 16, initials: "CF", type: "account", degree: 3 },
  { id: 17, initials: "CG", type: "market", degree: 4 },
  { id: 18, initials: "CH", type: "market", degree: 4 },
  { id: 19, initials: "CI", type: "market", degree: 4 },

  { id: 20, initials: "DA", type: "account", degree: 2 },
  { id: 21, initials: "DB", type: "account", degree: 2 },
  { id: 22, initials: "DC", type: "account", degree: 2 },

  { id: 23, initials: "EA", type: "account", degree: 2 },
  { id: 24, initials: "EB", type: "account", degree: 2 },
  { id: 25, initials: "EC", type: "account", degree: 2 },

  { id: 26, initials: "FA", type: "market", degree: 2 },
  { id: 27, initials: "FB", type: "market", degree: 2 },
  { id: 28, initials: "FC", type: "market", degree: 2 },
  { id: 29, initials: "FD", type: "account", degree: 3 },
  { id: 30, initials: "FE", type: "account", degree: 3 },
  { id: 31, initials: "FF", type: "account", degree: 3 }
];

const LINKS: Array<Link> = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 0, target: 4 },
  { source: 0, target: 5 },
  { source: 1, target: 5 },

  { source: 1, target: 6 },
  { source: 1, target: 7 },
  { source: 7, target: 8 },
  { source: 7, target: 9 },
  { source: 7, target: 10 },
  { source: 8, target: 9 },

  { source: 2, target: 11 },
  { source: 2, target: 12 },
  { source: 2, target: 13 },
  { source: 12, target: 14 },
  { source: 12, target: 15 },
  { source: 12, target: 16 },
  { source: 15, target: 17 },
  { source: 15, target: 18 },
  { source: 15, target: 19 },

  { source: 3, target: 20 },
  { source: 3, target: 21 },
  { source: 3, target: 22 },

  { source: 4, target: 23 },
  { source: 4, target: 24 },
  { source: 4, target: 25 },
  { source: 23, target: 3 },
  { source: 23, target: 20 },
  { source: 23, target: 21 },
  { source: 23, target: 22 },

  { source: 5, target: 26 },
  { source: 5, target: 27 },
  { source: 5, target: 28 },
  { source: 26, target: 27 },
  { source: 27, target: 29 },
  { source: 27, target: 30 },
  { source: 27, target: 31 },
  { source: 29, target: 30 }
];

const NODES_2 = [
  { id: 0, initials: "JS", type: "account", isRoot: true },
  { id: 1, initials: "ZB", type: "account", degree: 1 },
  { id: 2, initials: "DC", type: "account", degree: 1 },
  { id: 3, initials: "TD", type: "account", degree: 1 },
  { id: 4, initials: "SS", type: "market", degree: 1 },
  { id: 5, initials: "MS", type: "market", degree: 1 }
];

const LINKS_2 = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 0, target: 4 },
  { source: 0, target: 5 },
  { source: 1, target: 5 }
];

let count = 0;

function generateData() {
  const nodes = count % 2 === 0 ? NODES : NODES_2;
  const links = count % 2 === 0 ? LINKS : LINKS_2;
  const result = {
    nodes: cloneDeep(nodes),
    links: cloneDeep(links)
  };
  count += 1;
  return result;
}

const store = new Store<{
  data: any;
  selectedIds: Array<number>;
}>({
  data: generateData(),
  selectedIds: [] // sampleSize(range(0, 24 * 7), 3)
});

storiesOf("SteelEye/NetworkGraph", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("NetworkGraphExperiment", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => store.set({ data: generateData() })}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <NetworkGraphExperiment
              nodes={state.data.nodes}
              links={state.data.links}
              selectedIds={state.selectedIds}
              onNodeClick={value => {
                let newSelectedIds = state.selectedIds.slice();
                if (includes(newSelectedIds, value)) {
                  newSelectedIds = newSelectedIds.filter(x => x !== value);
                } else {
                  newSelectedIds.push(value);
                }
                store.set({
                  selectedIds: newSelectedIds
                });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
