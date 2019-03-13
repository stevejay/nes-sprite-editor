import React from "react";
import styles from "./WordCloud.module.scss";
import Measure from "react-measure";
import ModelessDialog from "../HeatMap/ModelessDialog";
import Tooltip from "../HeatMap/Tooltip";
import { WordCloudNode } from "./types";
import WordCloudHtml from "./WordCloudHtml";

type Props = {
  nodes: Array<WordCloudNode>;
  selectedIds: Array<WordCloudNode["id"]>;
  onNodeClick: (id: WordCloudNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  originRect?: ClientRect;
  tooltipData: WordCloudNode | null;
};

// Desired height could be passed in as a prop or a style

class WordCloud extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null };
  }

  handleShowTooltip = (value: WordCloudNode, originRect: ClientRect) => {
    this.setState({
      showTooltip: true,
      originRect: originRect,
      tooltipData: value as WordCloudNode
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (value: WordCloudNode) => {
    this.props.onNodeClick(value.id);
  };

  render() {
    const { nodes, selectedIds } = this.props;
    const { showTooltip, originRect, tooltipData } = this.state;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef} className={styles.container}>
            <WordCloudHtml
              nodes={nodes}
              selectedIds={selectedIds}
              width={contentRect.bounds ? contentRect.bounds.width : 0}
              height={contentRect.bounds ? contentRect.bounds.height : 0}
              onShowTooltip={this.handleShowTooltip}
              onHideTooltip={this.handleHideTooltip}
              onToggleNode={this.handleToggleNode}
            />
            <ModelessDialog isShowing={showTooltip}>
              <Tooltip originRect={originRect}>
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

export default WordCloud;
