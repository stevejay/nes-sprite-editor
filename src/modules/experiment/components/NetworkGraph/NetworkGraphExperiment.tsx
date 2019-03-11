import React from "react";
import styles from "./NetworkGraph.module.scss";
import Measure from "react-measure";
import NetworkGraphSVGExperiment from "./NetworkGraphSVGExperiment";
import ModelessDialog from "../HeatMap/ModelessDialog";
import Tooltip from "../HeatMap/Tooltip";
import { CommunicationsLink, CommunicationsNode } from "./NetworkGraph";
import { NodeEntity } from "./types";

type Props = {
  nodes: Array<CommunicationsNode>;
  links: Array<CommunicationsLink>;
  selectedIds: Array<CommunicationsNode["id"]>;
  onNodeClick: (id: CommunicationsNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  originRect?: ClientRect;
  tooltipData: CommunicationsNode | null;
};

// Desired height could be passed in as a prop or a style

class NetworkGraphExperiment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null };
  }

  handleShowTooltip = (value: NodeEntity, originRect: ClientRect) => {
    this.setState({
      showTooltip: true,
      originRect: originRect,
      tooltipData: value as CommunicationsNode
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (value: NodeEntity) => {
    this.props.onNodeClick(value.id);
  };

  /*
  nodes
  links
  selectedIds
  width
  height
  nodeGroupRenderer
  labelRenderer
  nodeRenderer
  onShowTooltip
  onHideTooltip
  onToggleNodeSelection
  */

  render() {
    const { nodes, links, selectedIds } = this.props;
    const { showTooltip, originRect, tooltipData } = this.state;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef} className={styles.graphContainer}>
            <NetworkGraphSVGExperiment
              nodes={nodes}
              links={links}
              selectedIds={selectedIds}
              width={contentRect.bounds ? contentRect.bounds.width : 0}
              height={contentRect.bounds ? contentRect.bounds.height : 0}
              labelAccessor={d => (d as CommunicationsNode).initials}
              onShowTooltip={this.handleShowTooltip}
              onHideTooltip={this.handleHideTooltip}
              onToggleNode={this.handleToggleNode}
            />
            <ModelessDialog isShowing={showTooltip}>
              <Tooltip originRect={originRect}>
                {tooltipData && (
                  <>
                    <p>{tooltipData.name}</p>
                    {Object.keys(tooltipData.commsDetail).map(key => {
                      const commsDetail = tooltipData.commsDetail[key];
                      return (
                        <p>
                          {commsDetail.count} with {commsDetail.name}
                        </p>
                      );
                    })}
                    {!!tooltipData.totalComms && (
                      <p>Total Comms: {tooltipData.totalComms}</p>
                    )}
                  </>
                )}
              </Tooltip>
            </ModelessDialog>
          </div>
        )}
      </Measure>
    );
  }
}

export default NetworkGraphExperiment;
