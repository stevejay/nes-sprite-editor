import React from "react";
import styles from "./WordCloudCanvas.module.scss";
import Measure from "react-measure";
import Tooltip from "../Tooltip/Tooltip";
import { WordCloudNode } from "../WordCloudCanvasChart";
import WordCloudCanvasChart from "../WordCloudCanvasChart";
import { TooltipData } from "../Tooltip/types";

type Props = {
  nodes: Array<WordCloudNode>;
  selectedNodeIds: Array<WordCloudNode["id"]>;
  onNodeClick: (node: WordCloudNode) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: WordCloudNode | null;
};

// Desired height could be passed in as a prop or a style

class WordCloudCanvas extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, target: null };
  }

  handleShowTooltip = (node: WordCloudNode, target: TooltipData["target"]) => {
    if (this.state.showTooltip && this.state.tooltipData === node) {
      return;
    }
    this.setState({
      showTooltip: true,
      target: target,
      tooltipData: node
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (node: WordCloudNode) => {
    this.props.onNodeClick(node);
  };

  render() {
    const { nodes, selectedNodeIds } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    return (
      <>
        <Measure bounds>
          {({ measureRef, contentRect }) => {
            const width = contentRect.bounds ? contentRect.bounds.width : 0;
            const height = contentRect.bounds ? contentRect.bounds.height : 0;
            return (
              <div ref={measureRef} className={styles.container}>
                <WordCloudCanvasChart
                  width={width}
                  height={height}
                  originXOffset={0}
                  cloudWidth={width}
                  nodes={nodes}
                  selectedNodeIds={selectedNodeIds}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                  onToggleNode={this.handleToggleNode}
                />
              </div>
            );
          }}
        </Measure>
        <Tooltip show={showTooltip} target={target} data={tooltipData}>
          {(data: WordCloudNode) => (
            <p>
              {data.value} {data.value === 0 ? "occurrence" : "occurrences"}
            </p>
          )}
        </Tooltip>
      </>
    );
  }
}

export default WordCloudCanvas;
