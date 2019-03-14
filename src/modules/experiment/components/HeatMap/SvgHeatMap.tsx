import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import { isNil } from "lodash";
import Tooltip from "../Tooltip/Tooltip";
import { TooltipData } from "../Tooltip/types";
import SvgHeatMapSvg from "./SvgHeatMapSvg";
import { HeatMapNode } from "./types";

type Props = {
  nodes: Array<HeatMapNode>;
  selectedIds: Array<number>;
  xLabels: Array<string>;
  yLabels: Array<string>;
  onToggleNode: (node: HeatMapNode) => void;
};

type State = {
  showTooltip: boolean;
  originRect: TooltipData["originRect"] | null;
  tooltipData: HeatMapNode | null;
};

class SvgHeatMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, originRect: null };
  }

  handleShowTooltip = (node: HeatMapNode, originRect: ClientRect) => {
    const datum = this.props.nodes[node.id];
    if (isNil(datum)) {
      this.handleHideTooltip();
      return;
    }
    this.setState({
      showTooltip: true,
      originRect,
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
    const { nodes, xLabels, yLabels, selectedIds } = this.props;
    const { showTooltip, originRect, tooltipData } = this.state;
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
                <SvgHeatMapSvg
                  width={contentRect.bounds ? contentRect.bounds.width || 0 : 0}
                  nodes={nodes}
                  selectedIds={selectedIds}
                  rows={yLabels.length}
                  columns={xLabels.length}
                  onToggleNode={this.handleToggleNode}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                />
              </div>
            )}
          </Measure>
          <Tooltip show={showTooltip} target={originRect} data={tooltipData}>
            {(data: HeatMapNode) => (
              <>
                <p>
                  {data.day} {data.hour}
                </p>
                {data.details &&
                  data.details.map(datum => (
                    <p key={datum.id}>
                      {datum.id}: {datum.count}
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
