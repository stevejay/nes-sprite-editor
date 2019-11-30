import React from "react";
import styles from "./NetworkGraph.module.scss";
import Measure from "react-measure";
import ModelessDialog from "../HeatMap/ModelessDialog";
import Tooltip from "../HeatMap/Tooltip";
import {
  CommunicationsLink,
  CommunicationsNode
} from "../../CommsNetworkGraph";
import { NodeEntity } from "../../NetworkGraph/types";
import ReactNetworkGraphSVG from "./ReactNetworkGraphSVG";

type Props = {
  nodes: Array<CommunicationsNode>;
  links: Array<CommunicationsLink>;
  selectedIds: Array<CommunicationsNode["id"]>;
  onNodeClick: (id: CommunicationsNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  target?: ClientRect;
  tooltipData: CommunicationsNode | null;
};

// Desired height could be passed in as a prop or a style

class ReactNetworkGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null };
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
            <ReactNetworkGraphSVG
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
              <Tooltip target={target}>
                {tooltipData && (
                  <>
                    <p>{tooltipData.initials}</p>
                    <p>Some info</p>
                    <p>Some more info 2</p>
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

export default ReactNetworkGraph;
