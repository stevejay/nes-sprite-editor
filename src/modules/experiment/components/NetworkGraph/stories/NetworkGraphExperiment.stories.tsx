import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { cloneDeep, includes } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import { CommunicationsNode, CommunicationsLink } from "../NetworkGraph";
import { default as NetworkGraphExperiment } from "../NetworkGraphExperiment";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const NODES: Array<CommunicationsNode> = [
  { id: "0", initials: "JS", type: "account", isRoot: true },
  { id: "1", initials: "ZB", type: "account", degree: 1 },
  { id: "2", initials: "DC", type: "account", degree: 1 },
  { id: "3", initials: "TD", type: "account", degree: 1 },
  { id: "4", initials: "SS", type: "market", degree: 1 },
  { id: "5", initials: "MS", type: "market", degree: 1 },

  { id: "6", initials: "AA", type: "account", degree: 2 },
  { id: "7", initials: "BB", type: "account", degree: 2 },
  { id: "8", initials: "BC", type: "account", degree: 3 },
  { id: "9", initials: "BD", type: "account", degree: 3 },
  { id: "10", initials: "BE", type: "account", degree: 3 },

  { id: "11", initials: "CA", type: "market", degree: 2 },
  { id: "12", initials: "CB", type: "market", degree: 2 },
  { id: "13", initials: "CC", type: "account", degree: 2 },
  { id: "14", initials: "CD", type: "account", degree: 3 },
  { id: "15", initials: "CE", type: "account", degree: 3 },
  { id: "16", initials: "CF", type: "account", degree: 3 },
  { id: "17", initials: "CG", type: "market", degree: 4 },
  { id: "18", initials: "CH", type: "market", degree: 4 },
  { id: "19", initials: "CI", type: "market", degree: 4 },

  { id: "20", initials: "DA", type: "account", degree: 2 },
  { id: "21", initials: "DB", type: "account", degree: 2 },
  { id: "22", initials: "DC", type: "account", degree: 2 },

  { id: "23", initials: "EA", type: "account", degree: 2 },
  { id: "24", initials: "EB", type: "account", degree: 2 },
  { id: "25", initials: "EC", type: "account", degree: 2 },

  { id: "26", initials: "FA", type: "market", degree: 2 },
  { id: "27", initials: "FB", type: "market", degree: 2 },
  { id: "28", initials: "FC", type: "market", degree: 2 },
  { id: "29", initials: "FD", type: "account", degree: 3 },
  { id: "30", initials: "FE", type: "account", degree: 3 },
  { id: "31", initials: "FF", type: "account", degree: 3 }
];

const LINKS: Array<CommunicationsLink> = [
  { id: "L0", source: "0", target: "1" },
  { id: "L1", source: "0", target: "2" },
  { id: "L2", source: "0", target: "3" },
  { id: "L3", source: "0", target: "4" },
  { id: "L4", source: "0", target: "5" },
  { id: "L5", source: "1", target: "5" },

  { id: "L6", source: "1", target: "6" },
  { id: "L7", source: "1", target: "7" },
  { id: "L8", source: "7", target: "8" },
  { id: "L9", source: "7", target: "9" },
  { id: "L10", source: "7", target: "10" },
  { id: "L11", source: "8", target: "9" },

  { id: "L12", source: "2", target: "11" },
  { id: "L13", source: "2", target: "12" },
  { id: "L14", source: "2", target: "13" },
  { id: "L15", source: "12", target: "14" },
  { id: "L16", source: "12", target: "15" },
  { id: "L17", source: "12", target: "16" },
  { id: "L18", source: "15", target: "17" },
  { id: "L19", source: "15", target: "18" },
  { id: "L20", source: "15", target: "19" },

  { id: "L21", source: "3", target: "20" },
  { id: "L22", source: "3", target: "21" },
  { id: "L23", source: "3", target: "22" },

  { id: "L24", source: "4", target: "23" },
  { id: "L25", source: "4", target: "24" },
  { id: "L26", source: "4", target: "25" },
  { id: "L27", source: "23", target: "3" },
  { id: "L28", source: "23", target: "20" },
  { id: "L29", source: "23", target: "21" },
  { id: "L30", source: "23", target: "22" },

  { id: "L31", source: "5", target: "26" },
  { id: "L32", source: "5", target: "27" },
  { id: "L33", source: "5", target: "28" },
  { id: "L34", source: "26", target: "27" },
  { id: "L35", source: "27", target: "29" },
  { id: "L36", source: "27", target: "30" },
  { id: "L37", source: "27", target: "31" },
  { id: "L38", source: "29", target: "30" }
];

const NODES_2: Array<CommunicationsNode> = [
  { id: "0", initials: "JS", type: "account", isRoot: true },
  { id: "1", initials: "ZB", type: "account", degree: 1 },
  { id: "2", initials: "DC", type: "account", degree: 1 },
  { id: "3", initials: "TD", type: "account", degree: 1 },
  { id: "5", initials: "MS", type: "market", degree: 1 }
];

const LINKS_2: Array<CommunicationsLink> = [
  { id: "L0", source: "0", target: "1" },
  { id: "L1", source: "0", target: "2" },
  { id: "L2", source: "0", target: "3" },
  { id: "L3", source: "0", target: "5" },
  { id: "L4", source: "1", target: "5" }
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
  selectedIds: Array<string>;
}>({
  data: generateData(),
  selectedIds: [] // sampleSize(range(0, 24 * 7), 3)
});

storiesOf("SteelEye/NetworkGraphExperiment", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
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
