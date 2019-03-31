import React from "react";
import ReactResizeDetector from "react-resize-detector";

import styles from "./CommsNetworkGraph.module.scss";
import { NodeEntity } from "../NetworkGraph/types";
import Tooltip, { TooltipData } from "../Tooltip";
import { CommunicationsNode, CommunicationsLink } from "./types";
import CommsNetworkGraphChart from "./CommsNetworkGraphChart";

type Props = {
  nodes: Array<CommunicationsNode>;
  links: Array<CommunicationsLink>;
  selectedIds: Array<CommunicationsNode["id"]>;
  onNodeClick: (id: CommunicationsNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: CommunicationsNode | null;
};

// Desired height could be passed in as a prop or a style

class CommsNetworkGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, target: null };
  }

  handleShowTooltip = (value: NodeEntity, target: ClientRect) => {
    this.setState({
      showTooltip: true,
      target: target,
      tooltipData: value as CommunicationsNode
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (value: NodeEntity) => {
    this.props.onNodeClick(value.id);
  };

  render() {
    const { nodes, links, selectedIds } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    return (
      <>
        <ReactResizeDetector
          handleWidth
          handleHeight
          refreshMode="debounce"
          refreshRate={500}
        >
          {({ width, height }: { width: number; height: number }) => (
            <div className={styles.container}>
              <CommsNetworkGraphChart
                nodes={nodes}
                links={links}
                selectedIds={selectedIds}
                width={width}
                height={height}
                onShowTooltip={this.handleShowTooltip}
                onHideTooltip={this.handleHideTooltip}
                onToggleNode={this.handleToggleNode}
              />
            </div>
          )}
        </ReactResizeDetector>
        <Tooltip show={showTooltip} target={target} data={tooltipData}>
          {(data: CommunicationsNode) => (
            <>
              <p>{data.name}</p>
              {Object.keys(data.commsDetail).map((key, index) => {
                const commsDetail = data.commsDetail[key];
                return (
                  <p key={index}>
                    {commsDetail.count} with {commsDetail.name}
                  </p>
                );
              })}
              {!!data.totalComms && <p>Total Comms: {data.totalComms}</p>}
            </>
          )}
        </Tooltip>
      </>
    );
  }
}

export default CommsNetworkGraph;
