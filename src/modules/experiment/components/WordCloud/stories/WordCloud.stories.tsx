import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { cloneDeep, includes, random } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
// import {
//   default as NetworkGraph,
//   CommunicationsNode,
//   CommunicationsLink
// } from "../NetworkGraph";

type Props = {
  nodes: Array<WordCloudNode>;
};

class WordCloud extends React.Component<Props> {
  render() {
    return <svg />;
  }
}

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const WORDS = [
  "labore",
  "exercitation",
  "dolore",
  "culpa",
  "consequat",
  "proident",
  "elit",
  "elit",
  "sunt",
  "cillum",
  "do",
  "reprehenderit",
  "qui",
  "pariatur",
  "sunt",
  "duis",
  "aute",
  "enim",
  "cupidatat",
  "cupidatat",
  "amet",
  "qui",
  "incididunt",
  "cupidatat",
  "velit",
  "culpa",
  "sunt",
  "cillum",
  "ad",
  "ea",
  "consectetur",
  "commodo",
  "mollit",
  "ex",
  "amet",
  "commodo",
  "aute",
  "nulla",
  "minim",
  "commodo",
  "ea",
  "non",
  "Lorem",
  "deserunt",
  "enim",
  "in",
  "voluptate",
  "ad",
  "ipsum",
  "enim",
  "nisi",
  "consequat",
  "ex",
  "dolore",
  "labore",
  "culpa",
  "fugiat",
  "qui",
  "velit",
  "nostrud",
  "ullamco",
  "non",
  "enim",
  "officia",
  "exercitation",
  "et",
  "sunt",
  "deserunt",
  "anim",
  "in",
  "irure",
  "veniam",
  "sit",
  "adipisicing",
  "eiusmod",
  "minim",
  "fugiat",
  "cupidatat",
  "anim",
  "ex",
  "commodo",
  "labore",
  "non",
  "sunt",
  "est",
  "ad",
  "ipsum",
  "proident",
  "Lorem",
  "labore",
  "nulla",
  "qui",
  "labore",
  "veniam",
  "anim",
  "aliquip",
  "Lorem",
  "consequat",
  "nisi",
  "consectetur"
];

// let count = 0;

type WordCloudNode = {
  id: string;
  count: number;
  word: string;
};

function generateData() {
  return WORDS.map((word, index) => ({
    id: `${index}`,
    count: random(1, 500),
    word
  }));
}

const store = new Store<{
  data: Array<WordCloudNode>;
  selectedIds: Array<string>;
}>({
  data: generateData(),
  selectedIds: [] // sampleSize(range(0, 24 * 7), 3)
});

storiesOf("SteelEye/WordCloud", module)
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
        <State store={store}>{state => <WordCloud nodes={state.data} />}</State>
      </div>
    </div>
  ));
