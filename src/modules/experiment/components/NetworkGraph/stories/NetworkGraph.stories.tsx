import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { random, range } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import NetworkGraph from "../NetworkGraph";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const NODES = [
  { id: 1, initials: "JS", type: "account", isRoot: true },
  { id: 2, initials: "ZB", type: "account" },
  { id: 3, initials: "DC", type: "account" },
  { id: 4, initials: "TD", type: "account" },
  { id: 5, initials: "SS", type: "market" },
  { id: 6, initials: "MS", type: "market" },

  { id: 7, initials: "AA", type: "account" },
  { id: 8, initials: "BB", type: "account" },
  { id: 9, initials: "BC", type: "account" },
  { id: 10, initials: "BD", type: "account" },
  { id: 11, initials: "BE", type: "account" },

  { id: 12, initials: "CA", type: "market" },
  { id: 13, initials: "CB", type: "market" },
  { id: 14, initials: "CC", type: "account" },
  { id: 15, initials: "CD", type: "account" },
  { id: 16, initials: "CE", type: "account" },
  { id: 17, initials: "CF", type: "account" },
  { id: 18, initials: "CG", type: "market" },
  { id: 19, initials: "CH", type: "market" },
  { id: 20, initials: "CI", type: "market" },

  { id: 21, initials: "DA", type: "account" },
  { id: 22, initials: "DB", type: "account" },
  { id: 23, initials: "DC", type: "account" },

  { id: 24, initials: "EA", type: "account" },
  { id: 25, initials: "EB", type: "account" },
  { id: 26, initials: "EC", type: "account" },

  { id: 27, initials: "FA", type: "market" },
  { id: 28, initials: "FB", type: "market" },
  { id: 29, initials: "FC", type: "market" },
  { id: 30, initials: "FD", type: "account" },
  { id: 31, initials: "FE", type: "account" },
  { id: 32, initials: "FF", type: "account" }
];

const LINKS = [
  { source: NODES[1 - 1], target: NODES[2 - 1] },
  { source: NODES[1 - 1], target: NODES[3 - 1] },
  { source: NODES[1 - 1], target: NODES[4 - 1] },
  { source: NODES[1 - 1], target: NODES[5 - 1] },
  { source: NODES[1 - 1], target: NODES[6 - 1] },
  { source: NODES[2 - 1], target: NODES[6 - 1] },

  { source: NODES[2 - 1], target: NODES[7 - 1] },
  { source: NODES[2 - 1], target: NODES[8 - 1] },
  { source: NODES[8 - 1], target: NODES[9 - 1] },
  { source: NODES[8 - 1], target: NODES[10 - 1] },
  { source: NODES[8 - 1], target: NODES[11 - 1] },
  { source: NODES[9 - 1], target: NODES[10 - 1] },

  { source: NODES[3 - 1], target: NODES[12 - 1] },
  { source: NODES[3 - 1], target: NODES[13 - 1] },
  { source: NODES[3 - 1], target: NODES[14 - 1] },
  { source: NODES[13 - 1], target: NODES[15 - 1] },
  { source: NODES[13 - 1], target: NODES[16 - 1] },
  { source: NODES[13 - 1], target: NODES[17 - 1] },
  { source: NODES[16 - 1], target: NODES[18 - 1] },
  { source: NODES[16 - 1], target: NODES[19 - 1] },
  { source: NODES[16 - 1], target: NODES[20 - 1] },

  { source: NODES[4 - 1], target: NODES[21 - 1] },
  { source: NODES[4 - 1], target: NODES[22 - 1] },
  { source: NODES[4 - 1], target: NODES[23 - 1] },

  { source: NODES[5 - 1], target: NODES[24 - 1] },
  { source: NODES[5 - 1], target: NODES[25 - 1] },
  { source: NODES[5 - 1], target: NODES[26 - 1] },
  { source: NODES[24 - 1], target: NODES[4 - 1] },
  { source: NODES[24 - 1], target: NODES[21 - 1] },
  { source: NODES[24 - 1], target: NODES[22 - 1] },
  { source: NODES[24 - 1], target: NODES[23 - 1] },

  { source: NODES[6 - 1], target: NODES[27 - 1] },
  { source: NODES[6 - 1], target: NODES[28 - 1] },
  { source: NODES[6 - 1], target: NODES[29 - 1] },
  { source: NODES[27 - 1], target: NODES[28 - 1] },
  { source: NODES[28 - 1], target: NODES[30 - 1] },
  { source: NODES[28 - 1], target: NODES[31 - 1] },
  { source: NODES[28 - 1], target: NODES[32 - 1] },
  { source: NODES[30 - 1], target: NODES[31 - 1] }
];

const NODES_2 = [
  { id: 1, initials: "JS", type: "account", isRoot: true },
  { id: 2, initials: "ZB", type: "account" },
  { id: 3, initials: "DC", type: "account" },
  { id: 4, initials: "TD", type: "account" },
  { id: 5, initials: "SS", type: "market" },
  { id: 6, initials: "MS", type: "market" }
];

const LINKS_2 = [
  { source: NODES_2[1 - 1], target: NODES_2[2 - 1] },
  { source: NODES_2[1 - 1], target: NODES_2[3 - 1] },
  { source: NODES_2[1 - 1], target: NODES_2[4 - 1] },
  { source: NODES_2[1 - 1], target: NODES_2[5 - 1] },
  { source: NODES_2[1 - 1], target: NODES_2[6 - 1] },
  { source: NODES_2[2 - 1], target: NODES_2[6 - 1] }
];

let count = 0;

function generateData() {
  const nodes = count % 2 === 0 ? NODES : NODES_2;
  const links = count % 2 === 0 ? LINKS : LINKS_2;
  const result = {
    nodes: nodes.slice(),
    links: links.slice()
  };
  count += 1;
  return result;
}

const store = new Store<{
  data: any;
  selectedIndexes: Array<number>;
}>({
  data: generateData(),
  selectedIndexes: [] // sampleSize(range(0, 24 * 7), 3)
});

storiesOf("SteelEye/NetworkGraph", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("NetworkGraph", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => store.set({ data: generateData() })}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => {
            // console.log("state.data", state.data);
            return (
              <NetworkGraph nodes={state.data.nodes} links={state.data.links} />
            );
          }}
        </State>
      </div>
    </div>
  ));
