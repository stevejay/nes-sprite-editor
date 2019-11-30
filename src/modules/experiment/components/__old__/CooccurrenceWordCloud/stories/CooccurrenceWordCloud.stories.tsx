import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { random, sortBy, reverse, sampleSize, includes, isNil } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import { WordCloudNode } from "../../WordCloud/types";
import CooccurrenceWordCloud from "../CooccurrenceWordCloud";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const WORDS = [
  "rich",
  "battlefield",
  "lip",
  "screw",
  "experiment",
  "frog",
  "flower",
  "sermon",
  "screen",
  "report",
  "direction",
  "survivor",
  "attitude",
  "feeling",
  "difference",
  "kidnap",
  "appetite",
  "confrontation",
  "guide",
  "confine",
  "health",
  "parade",
  "perception",
  "impact",
  "slab",
  "evening",
  "teacher",
  "lily",
  "dip",
  "avenue",
  "bill",
  "victory",
  "marsh",
  "describe",
  "exploration",
  "despair",
  "autonomy",
  "salvation",
  "notice",
  "species",
  "impound",
  "conglomerate",
  "exhibition",
  "nominate",
  "shed",
  "format",
  "harmony",
  "integrity",
  "cycle",
  "advice",
  "begin",
  "texture",
  "dictate",
  "dedicate",
  "carrot",
  "craftsman",
  "introduction",
  "acceptance",
  "slime",
  "tradition",
  "contradiction",
  "insure",
  "organisation",
  "bake",
  "challenge",
  "sacred",
  "bald",
  "mile",
  "accept",
  "charismatic",
  "critical",
  "tolerate",
  "miner",
  "session",
  "route",
  "snub",
  "basic",
  "outlet",
  "steel",
  "novel",
  "tourist",
  "important",
  "symbol",
  "window",
  "criminal",
  "pasture",
  "husband",
  "satisfied",
  "contain",
  "tactic",
  "engagement",
  "past",
  "alarm",
  "pick",
  "cheese",
  "surprise",
  "clearance",
  "decay",
  "station",
  "commission",
  "unpleasant",
  "complete",
  "fool around",
  "gain",
  "interface",
  "revolutionary",
  "conservation",
  "policeman",
  "stall",
  "audience",
  "sense",
  "young",
  "art",
  "part",
  "dash",
  "determine",
  "response",
  "bend",
  "crisis",
  "bury",
  "notion",
  "bargain",
  "economist",
  "dry",
  "occasion",
  "see",
  "thought",
  "structure",
  "entitlement",
  "wording",
  "eaux",
  "vegetation",
  "line",
  "rise",
  "failure",
  "rain",
  "lack",
  "productive",
  "technique",
  "railroad",
  "unaware",
  "oak",
  "moral",
  "manufacture",
  "sandwich",
  "due",
  "power",
  "essential",
  "question",
  "flood",
  "poor",
  "turn",
  "waiter",
  "strict",
  "civilian",
  "fight",
  "shortage",
  "fisherman",
  "joke",
  "close",
  "first",
  "paralyzed",
  "publisher",
  "digress",
  "jaw",
  "blackmail",
  "will",
  "finished",
  "detail",
  "means",
  "reduce",
  "bowel",
  "cottage",
  "hesitate",
  "request",
  "mislead",
  "catalogue",
  "possession",
  "neighborhood",
  "guideline",
  "fee",
  "advertising",
  "architect",
  "price",
  "equal",
  "econobox",
  "loot",
  "reptile",
  "fixture",
  "stunning",
  "dull",
  "rider",
  "dirty",
  "cell phone",
  "brainstorm",
  "regular",
  "entry",
  "aware",
  "construct",
  "celebration",
  "well",
  "dynamic",
  "understand",
  "diamond",
  "direct",
  "tissue",
  "program",
  "voter",
  "absolute",
  "pain",
  "pill",
  "mixture",
  "card",
  "pleasure",
  "mourning",
  "short",
  "ring",
  "coverage",
  "ferry",
  "domestic",
  "champion",
  "surround",
  "crosswalk",
  "enter",
  "dictionary",
  "serve",
  "spend",
  "crack",
  "user",
  "crown",
  "appointment",
  "illness",
  "stable",
  "racism",
  "laundry",
  "fit",
  "prayer",
  "express",
  "likely",
  "colon",
  "orientation",
  "sensation",
  "guilt",
  "text",
  "relative",
  "cake",
  "education",
  "product",
  "light",
  "surface",
  "responsibility",
  "spectrum",
  "warn",
  "speech",
  "wreck",
  "feather",
  "doll",
  "hierarchy",
  "shot",
  "tap",
  "industry",
  "pawn",
  "bench",
  "say",
  "stand",
  "reception",
  "voyage",
  "opposite",
  "letter",
  "referee",
  "constellation",
  "tone",
  "invite",
  "design",
  "leg",
  "absence",
  "jam",
  "define",
  "model",
  "suit",
  "snatch",
  "riot",
  "remunerate",
  "tract",
  "fog",
  "map",
  "circle",
  "ex",
  "court",
  "butterfly",
  "presidential",
  "defeat",
  "produce",
  "expression",
  "parachute",
  "comfortable",
  "mechanical",
  "cap",
  "funeral",
  "closed"
];

function getRandomValue() {
  switch (random(0, 4)) {
    case 0:
      return random(1, 25);
    case 1:
      return random(26, 75);
    case 2:
      return random(76, 150);
    case 3:
      return random(151, 250);
    case 4:
      return random(251, 500);
    default:
      throw new Error("oops");
  }
}

function generateData() {
  let words = sampleSize(
    WORDS.filter((v, i, a) => a.indexOf(v) === i),
    100
  ).map(
    text =>
      ({
        id: text,
        text,
        value: getRandomValue()
      } as WordCloudNode)
  );
  words = reverse(sortBy(words, word => word.value));
  return words;
}

const store = new Store<{
  data: {
    nodes: Array<WordCloudNode>;
    withNodes: Array<WordCloudNode>;
  };
  sourceNodeId: string | null;
  withNodeIds: Array<string>;
}>({
  data: {
    nodes: generateData(),
    withNodes: []
  },
  sourceNodeId: null,
  withNodeIds: []
});

storiesOf("SE_OLD/CooccurrenceWordCloud", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() =>
          store.set({
            data: {
              nodes: generateData(),
              withNodes: []
            },
            sourceNodeId: null,
            withNodeIds: []
          })
        }
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <CooccurrenceWordCloud
              nodes={state.data.nodes}
              withNodes={state.data.withNodes}
              sourceNodeId={state.sourceNodeId}
              withNodeIds={state.withNodeIds}
              onSourceNodeClick={value => {
                const existingSourceNodeId = state.sourceNodeId;
                const newSourceNodeId =
                  value === existingSourceNodeId ? null : value;
                store.set({ sourceNodeId: newSourceNodeId });
                if (isNil(existingSourceNodeId) && !isNil(newSourceNodeId)) {
                  const newData = {
                    nodes: state.data.nodes,
                    withNodes: generateData()
                  };
                  store.set({ data: newData });
                } else if (
                  !isNil(existingSourceNodeId) &&
                  isNil(newSourceNodeId)
                ) {
                  store.set({
                    data: {
                      nodes: state.data.nodes,
                      withNodes: []
                    }
                  });
                }
              }}
              onWithNodeClick={value => {
                let newWithNodeIds = state.withNodeIds.slice();
                if (includes(newWithNodeIds, value)) {
                  newWithNodeIds = newWithNodeIds.filter(x => x !== value);
                } else {
                  newWithNodeIds.push(value);
                }
                store.set({
                  withNodeIds: newWithNodeIds
                });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
