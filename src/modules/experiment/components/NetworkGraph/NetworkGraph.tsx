import React from "react";
import styles from "./NetworkGraph.module.scss";
import Measure from "react-measure";
import NetworkGraphSVG from "./NetworkGraphSVG";

export type Node = {
  id: number;
  initials: string;
  type: string; // should be account or market
  degree?: number;
  isRoot?: boolean;
  x?: number;
  y?: number;
  px?: number;
  py?: number;
  fx?: number;
  fy?: number;
};

export type Link = {
  source: number | Node;
  target: number | Node;
};

type Props = {
  nodes: Array<Node>;
  links: Array<Link>;
};

// Desired height could be passed in as a prop or a style

class NetworkGraph extends React.Component<Props> {
  render() {
    const { nodes, links } = this.props;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef} className={styles.graphContainer}>
            <NetworkGraphSVG
              nodes={nodes}
              links={links}
              width={contentRect.bounds ? contentRect.bounds.width : 0}
              height={contentRect.bounds ? contentRect.bounds.height : 0}
            />
          </div>
        )}
      </Measure>
    );
  }
}

export default NetworkGraph;
