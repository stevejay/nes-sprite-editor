import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import Tooltip from "../Tooltip/Tooltip";
import { TooltipData } from "../Tooltip/types";
import HeatMapChart from "./HeatMapChart";
import { HeatMapNode } from "./types";

type Props = {
  nodes: Array<HeatMapNode>;
  selectedIds: Array<number>;
  xLabels: Array<string>;
  yLabels: Array<string>;
  coloring?: (node: HeatMapNode, selected: boolean) => string;
  onToggleNode: (node: HeatMapNode) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: HeatMapNode | null;
};

class SvgHeatMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, target: null };
  }

  handleShowTooltip = (node: HeatMapNode, target: TooltipData["target"]) => {
    const datum = this.props.nodes[node.id];
    if (!datum || !datum.count) {
      this.handleHideTooltip();
      return;
    }
    this.setState({
      showTooltip: true,
      target,
      tooltipData: datum
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (node: HeatMapNode) => {
    this.props.onToggleNode(node);
  };

  render() {
    const { nodes, xLabels, yLabels, selectedIds, coloring } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.yAxisContainer}>
            {yLabels.map((label, index) => (
              <div key={index} className={styles.yLabel}>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.xAxisContainer}>
            {xLabels.map((label, index) => (
              <div key={index} className={styles.xLabel}>
                {label}
              </div>
            ))}
          </div>
          <Measure bounds>
            {({ measureRef, contentRect }) => (
              <div ref={measureRef} className={styles.chartContainer}>
                <HeatMapChart
                  width={contentRect.bounds ? contentRect.bounds.width || 0 : 0}
                  nodes={nodes}
                  selectedIds={selectedIds}
                  rows={yLabels.length}
                  columns={xLabels.length}
                  coloring={coloring}
                  onToggleNode={this.handleToggleNode}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                />
              </div>
            )}
          </Measure>
          <Tooltip show={showTooltip} target={target} data={tooltipData}>
            {(data: HeatMapNode) => (
              <>
                <p>
                  {data.day} {data.hour}
                </p>
                {data.details &&
                  data.details.map(datum => (
                    <p key={datum.channel}>
                      {datum.channel}: {datum.count}
                    </p>
                  ))}
              </>
            )}
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default SvgHeatMap;
