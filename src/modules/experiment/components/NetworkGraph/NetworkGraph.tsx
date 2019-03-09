import React from "react";
import styles from "./NetworkGraph.module.scss";
import Measure from "react-measure";
import NetworkGraphSVG from "./NetworkGraphSVG";
import ModelessDialog from "../HeatMap/ModelessDialog";
import Tooltip from "../HeatMap/Tooltip";

export type D3Node = {
  id: number | string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export type CommunicationsNode = {
  id: number;
  initials: string;
  type: string; // should be account or market
  degree?: number;
  isRoot?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export type Link = {
  source: number | CommunicationsNode;
  target: number | CommunicationsNode;
};

type Props = {
  nodes: Array<CommunicationsNode>;
  links: Array<Link>;
  selectedIds: Array<number>;
  onNodeClick: (index: number) => void;
};

type State = {
  showTooltip: boolean;
  originRect?: ClientRect;
  tooltipData: CommunicationsNode | null;
};

// Desired height could be passed in as a prop or a style

class NetworkGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null };
  }

  handleShowTooltip = (value: CommunicationsNode, originRect: ClientRect) => {
    this.setState({
      showTooltip: true,
      originRect: originRect,
      tooltipData: value
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (value: CommunicationsNode) => {
    this.props.onNodeClick(value.id);
  };

  render() {
    const { nodes, links, selectedIds } = this.props;
    const { showTooltip, originRect, tooltipData } = this.state;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef} className={styles.graphContainer}>
            <NetworkGraphSVG
              nodes={nodes}
              links={links}
              selectedIds={selectedIds}
              width={contentRect.bounds ? contentRect.bounds.width : 0}
              height={contentRect.bounds ? contentRect.bounds.height : 0}
              onShowTooltip={this.handleShowTooltip}
              onHideTooltip={this.handleHideTooltip}
              onToggleNode={this.handleToggleNode}
            />
            <ModelessDialog isShowing={showTooltip}>
              <Tooltip originRect={originRect}>
                <p>{tooltipData ? tooltipData.initials : ""}</p>
                <p>Some info</p>
                <p>Some more info 2</p>
              </Tooltip>
            </ModelessDialog>
          </div>
        )}
      </Measure>
    );
  }
}

export default NetworkGraph;
