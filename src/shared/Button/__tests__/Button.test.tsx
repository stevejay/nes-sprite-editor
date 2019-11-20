import React from "react";
import { noop } from "lodash";
import { render } from "@testing-library/react";
import Button from "../Button";
import { FiX } from "react-icons/fi";

test("displays correctly with icon", async () => {
  const { container } = render(<Button icon={FiX} onClick={noop} />);
  expect(container).toMatchSnapshot();
});
