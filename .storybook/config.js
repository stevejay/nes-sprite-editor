import { addParameters, configure } from "@storybook/react";

addParameters({
  backgrounds: [
    { name: "main", value: "#fff", default: true },
    { name: "header", value: "rgba(178, 255, 89, 0.25)" }
  ]
});

const req = require.context("../src", true, /\.stories\.tsx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
