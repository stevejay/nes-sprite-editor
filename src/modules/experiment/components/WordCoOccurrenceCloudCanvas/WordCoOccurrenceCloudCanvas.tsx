import React from "react";
import styles from "./WordCoOccurrenceCloudCanvas.module.scss";
import Tooltip from "../Tooltip/Tooltip";
import { WordCloudNode } from "../WordCloudCanvasChart";
import WordCloudCanvasChart from "../WordCloudCanvasChart";
import { TooltipData } from "../Tooltip/types";
import ExpanderGraphic from "./ExpanderGraphic";
import ReactResizeDetector from "react-resize-detector";

const CO_OCCURRENCE_DIVIDER_WIDTH_PX = 40;
const EMPTY_ARRAY: Array<WordCloudNode> = [];
const EMPTY_STR_ARRAY: Array<string> = [];

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

class WordCoOccurrenceCloudCanvas extends React.Component<Props, State> {
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
    if (this.state.showTooltip) {
      this.setState({ showTooltip: false });
    }
  };

  handleToggleNode = (node: WordCloudNode) => {
    this.props.onNodeClick(node);
  };

  render() {
    const { nodes, selectedNodeIds } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    // console.log("render coocc");
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
              <ExpanderGraphic
                show={!!selectedNodeIds.length}
                width={width}
                height={height}
              />
              <WordCloudCanvasChart
                width={width}
                height={height}
                originXOffset={
                  selectedNodeIds.length
                    ? -(width * 0.25 + CO_OCCURRENCE_DIVIDER_WIDTH_PX * 0.25)
                    : 0
                }
                cloudWidth={
                  selectedNodeIds.length
                    ? width * 0.5 - CO_OCCURRENCE_DIVIDER_WIDTH_PX * 0.5
                    : width
                }
                nodes={nodes}
                selectedNodeIds={selectedNodeIds}
                onShowTooltip={this.handleShowTooltip}
                onHideTooltip={this.handleHideTooltip}
                onToggleNode={this.handleToggleNode}
              />
              <WordCloudCanvasChart
                className={
                  selectedNodeIds.length
                    ? styles.withWordsChart
                    : styles.withWordsChartInactive
                }
                width={(width || 0) * 0.5}
                height={height || 0}
                originXOffset={CO_OCCURRENCE_DIVIDER_WIDTH_PX * 0.25}
                cloudWidth={
                  (width || 0) * 0.5 - CO_OCCURRENCE_DIVIDER_WIDTH_PX * 0.5
                }
                nodes={selectedNodeIds.length ? nodes : EMPTY_ARRAY}
                selectedNodeIds={EMPTY_STR_ARRAY}
                onShowTooltip={this.handleShowTooltip}
                onHideTooltip={this.handleHideTooltip}
                onToggleNode={this.handleToggleNode}
              />
            </div>
          )}
        </ReactResizeDetector>
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

export default WordCoOccurrenceCloudCanvas;
