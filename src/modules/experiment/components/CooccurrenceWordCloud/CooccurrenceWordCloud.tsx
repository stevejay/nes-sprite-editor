import React from "react";
import styles from "../WordCloud/WordCloud.module.scss";
import Measure from "react-measure";
import ModelessDialog from "../__old__/HeatMap/ModelessDialog";
import Tooltip from "../__old__/HeatMap/Tooltip";
import { WordCloudNode } from "../WordCloud/types";
import CooccurrenceWordCloudHtml from "./CooccurrenceWordCloudHtml";

type Props = {
  nodes: Array<WordCloudNode>;
  withNodes: Array<WordCloudNode>;
  sourceNodeId: WordCloudNode["id"] | null;
  withNodeIds: Array<WordCloudNode["id"]>;
  onSourceNodeClick: (id: WordCloudNode["id"]) => void;
  onWithNodeClick: (id: WordCloudNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  target?: ClientRect;
  tooltipData: WordCloudNode | null;
};

// Desired height could be passed in as a prop or a style

class CooccurrenceWordCloud extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null };
  }

  handleShowTooltip = (value: WordCloudNode, target: ClientRect) => {
    this.setState({
      showTooltip: true,
      target: target,
      tooltipData: value as WordCloudNode
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleSourceNode = (value: WordCloudNode) => {
    this.props.onSourceNodeClick(value.id);
  };

  handleToggleWithNode = (value: WordCloudNode) => {
    this.props.onWithNodeClick(value.id);
  };

  render() {
    const { nodes, withNodes, sourceNodeId, withNodeIds } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef} className={styles.container}>
            <CooccurrenceWordCloudHtml
              nodes={nodes}
              withNodes={withNodes}
              sourceNodeId={sourceNodeId}
              withNodeIds={withNodeIds}
              width={contentRect.bounds ? contentRect.bounds.width : 0}
              height={contentRect.bounds ? contentRect.bounds.height : 0}
              onShowTooltip={this.handleShowTooltip}
              onHideTooltip={this.handleHideTooltip}
              onToggleSourceNode={this.handleToggleSourceNode}
              onToggleWithNode={this.handleToggleWithNode}
            />
            <ModelessDialog isShowing={showTooltip}>
              <Tooltip target={target}>
                {tooltipData && (
                  <>
                    <p>
                      {tooltipData.value}{" "}
                      {tooltipData.value === 0 ? "occurrence" : "occurrences"}
                    </p>
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

export default CooccurrenceWordCloud;
