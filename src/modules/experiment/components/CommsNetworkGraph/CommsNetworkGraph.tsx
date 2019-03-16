import React from "react";
import styles from "./CommsNetworkGraph.module.scss";
import Measure from "react-measure";
import { NodeEntity } from "../NetworkGraph/types";
import Tooltip from "../Tooltip/Tooltip";
import { TooltipData } from "../Tooltip/types";
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
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef} className={styles.container}>
            <CommsNetworkGraphChart
              nodes={nodes}
              links={links}
              selectedIds={selectedIds}
              width={contentRect.bounds ? contentRect.bounds.width : 0}
              height={contentRect.bounds ? contentRect.bounds.height : 0}
              onShowTooltip={this.handleShowTooltip}
              onHideTooltip={this.handleHideTooltip}
              onToggleNode={this.handleToggleNode}
            />
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
          </div>
        )}
      </Measure>
    );
  }
}

export default CommsNetworkGraph;
