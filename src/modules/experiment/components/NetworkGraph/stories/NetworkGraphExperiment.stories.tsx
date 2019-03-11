import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { cloneDeep, includes, range } from "lodash";
import * as React from "react";
import delay from "delay";
import { host } from "storybook-host";
import "../../../../../index.scss";
import { CommunicationsNode, CommunicationsLink } from "../NetworkGraph";
import { default as NetworkGraphExperiment } from "../NetworkGraphExperiment";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const RESPONSE_0 = {
  aggregations: {
    participant: {
      doc_count: 940,
      filtered: {
        doc_count: 469,
        network: {
          doc_count_error_upper_bound: 2,
          sum_other_doc_count: 139,
          buckets: [
            {
              key: "6b0722ab-f7a1-5704-9966-28a3af048470|Paul Buck|Acc",
              doc_count: 101
            },
            {
              key: "91a653cd-a3ff-5802-a83b-602ab5566db1|Margaret Simpson|Acc",
              doc_count: 72
            },
            {
              key: "c3b5d28f-a027-5d52-aeed-1beae715ba93|William Crosby|Mar",
              doc_count: 56
            },
            {
              key: "00140ce3-0146-5e46-8d24-d9ce4def024a|Michael Wilson|Acc",
              doc_count: 54
            },
            {
              key: "09fa4fd3-2a51-59d3-abeb-e5070cf01466|Mary Burns|Acc",
              doc_count: 47
            }
          ]
        }
      }
    }
  }
};

// Paul Buck
const RESPONSE_1_0 = {
  aggregations: {
    participant: {
      doc_count: 100,
      filtered: {
        doc_count: 90,
        network: {
          doc_count_error_upper_bound: 2,
          sum_other_doc_count: 139,
          buckets: [
            {
              key: "91a653cd-a3ff-5802-a83b-602ab5566db1|Margaret Simpson|Acc",
              doc_count: 6
            },
            {
              key: "c3b5d28f-a027-5d52-aeed-1beae715ba93|William Crosby|Mar",
              doc_count: 2
            },
            {
              key: "2225d28f-a027-5d52-aeed-1beae715b222|Someone New|Mar",
              doc_count: 2
            }
          ]
        }
      }
    }
  }
};

// Margaret Simpson
const RESPONSE_1_1 = {
  aggregations: {
    participant: {
      doc_count: 100,
      filtered: {
        doc_count: 90,
        network: {
          doc_count_error_upper_bound: 2,
          sum_other_doc_count: 139,
          buckets: [
            {
              key: "3335d28f-a027-5d52-aeed-1beae715b333|Someone New2|Mar",
              doc_count: 18
            },
            {
              key: "4445d28f-a027-5d52-aeed-1beae715b444|Someone New3|Mar",
              doc_count: 6
            },
            {
              key: "6b0722ab-f7a1-5704-9966-28a3af048470|Paul Buck|Acc",
              doc_count: 3
            }
          ]
        }
      }
    }
  }
};

const KEY_REGEX = /^([^|]+)\|([^|]+)\|(Acc|Mar)$/i;

function getInitialsFromName(name: string) {
  const parts = name.split(" ").filter(part => part.length > 0);
  return parts.length === 0
    ? ""
    : parts.length === 1
    ? parts[0][0]
    : `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

function getPersonType(truncatedPersonType: string) {
  switch (truncatedPersonType) {
    case "Acc":
      return "account";
    case "Mar":
      return "market";
    default:
      throw new Error(`invalid truncated person type '${truncatedPersonType}'`);
  }
}

function parseServerResponse(
  response: any,
  depth: number,
  parentNode: CommunicationsNode
) {
  const result: {
    nodes: Array<CommunicationsNode>;
    links: Array<CommunicationsLink>;
    parentTotalComms: number;
  } = {
    nodes: [],
    links: [],
    parentTotalComms: response.aggregations.participant.filtered.doc_count
  };

  const network =
    response.aggregations.participant.filtered.network.buckets || [];

  network.forEach((networkEntry: any) => {
    const match = networkEntry.key.match(KEY_REGEX);
    if (!match) {
      return;
    }
    const childNode: CommunicationsNode = {
      id: match[1],
      depth,
      name: match[2],
      initials: getInitialsFromName(match[2]),
      type: getPersonType(match[3]),
      totalComms: 0,
      commsDetail: {
        [parentNode.id]: {
          name: parentNode.name,
          count: networkEntry.doc_count
        }
      }
    };
    const link: CommunicationsLink = {
      id: `${parentNode.id}--${childNode.id}`,
      source: parentNode.id,
      target: childNode.id
    };
    result.nodes.push(childNode);
    result.links.push(link);
  });

  return result;
}

function getChildDataForNode(
  rootNode: CommunicationsNode,
  parentNode: CommunicationsNode,
  existingNodesLookup: { [key: string]: CommunicationsNode },
  existingLinksLookup: { [key: string]: CommunicationsLink },
  response: any
) {
  const result: {
    nodes: Array<CommunicationsNode>;
    links: Array<CommunicationsLink>;
  } = { nodes: [], links: [] };
  const { nodes, links, parentTotalComms } = parseServerResponse(
    response,
    parentNode.depth + 1,
    parentNode
  );
  parentNode.totalComms = parentTotalComms;
  nodes.forEach(node => {
    const existingNode = existingNodesLookup[node.id];
    if (existingNode) {
      existingNode.commsDetail[parentNode.id] = node.commsDetail[parentNode.id];
    } else {
      existingNodesLookup[node.id] = node;
      result.nodes.push(node);
    }
  });
  links.forEach(link => {
    const existingLink = existingLinksLookup[link.id];
    if (!existingLink) {
      existingLinksLookup[link.id] = link;
      result.links.push(link);
    }
  });
  return result;
}

async function getData(
  rootParticipantId: CommunicationsNode["id"],
  rootParticipantName: CommunicationsNode["name"],
  rootParticipantType: CommunicationsNode["type"],
  callback: (data: {
    nodes: Array<CommunicationsNode>;
    links: Array<CommunicationsLink>;
  }) => void
) {
  const result: {
    nodes: Array<CommunicationsNode>;
    links: Array<CommunicationsLink>;
  } = { nodes: [], links: [] };

  const rootNode: CommunicationsNode = {
    id: rootParticipantId,
    depth: 0,
    name: rootParticipantName,
    initials: getInitialsFromName(rootParticipantName),
    type: rootParticipantType,
    totalComms: 0,
    commsDetail: {}
  };

  const nodesById: { [key: string]: CommunicationsNode } = {};
  const linksById: { [key: string]: CommunicationsLink } = {};
  nodesById[rootNode.id] = rootNode;
  result.nodes.push(rootNode);

  // TODO get data from server

  const { nodes, links } = getChildDataForNode(
    rootNode,
    rootNode,
    nodesById,
    linksById,
    RESPONSE_0
  );
  nodes.forEach(node => {
    result.nodes.push(node);
  });
  links.forEach(link => {
    result.links.push(link);
  });

  await delay(400);
  // callback({ nodes: [...result.nodes], links: [...result.links] });

  // TODO get second-level data from server

  [RESPONSE_1_0, RESPONSE_1_1].forEach((response, index) => {
    const { nodes: resultNodes, links } = getChildDataForNode(
      rootNode,
      nodes[index],
      nodesById,
      linksById,
      response
    );
    resultNodes.forEach(node => {
      result.nodes.push(node);
    });
    links.forEach(link => {
      result.links.push(link);
    });
  });

  // console.log("nodes", result.nodes);

  await delay(800);
  callback({ nodes: [...result.nodes], links: [...result.links] });
}

// function generateData(
//   callback: (data: {
//     nodes: Array<CommunicationsNode>;
//     links: Array<CommunicationsLink>;
//   }) => void
// ) {
//   return getData("111111", "Steve Jay", "account", callback);
// }

const store = new Store<{
  data: any;
  selectedIds: Array<string>;
}>({
  data: [], //generateData(),
  selectedIds: [] // sampleSize(range(0, 24 * 7), 3)
});

storiesOf("SteelEye/NetworkGraphExperiment", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => {
          getData("111111", "Steve Jay", "account", data =>
            store.set({ data })
          );
        }}
        // store.set({ data: generateData() })}
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
