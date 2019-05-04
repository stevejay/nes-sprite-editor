import { padStart, take, isEmpty } from "lodash";
import React from "react";
import ReactResizeDetector from "react-resize-detector";
import Tooltip from "../Tooltip/Tooltip";
import { TooltipData } from "../Tooltip/types";
import styles from "./HeatMapSpriteJs.module.scss";
import HeatMapSpriteJsChart from "./HeatMapSpriteJsChart";
import { HeatMapNode } from "./types";

// TODO own file:
function displayHour(hour: number) {
  return `${padStart(hour.toString(), 2, "0")}:00`;
}

// TODO own file:
function displayDay(day: number) {
  switch (day) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Sunday";
  }
}

type Props = {
  nodes: Array<HeatMapNode>;
  selectedIds: Array<number>;
  xLabels: Array<string>;
  yLabels: Array<string>;
  fill?: (node: HeatMapNode, selected: boolean) => string;
  onToggleNode: (node: HeatMapNode) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: HeatMapNode | null;
};

class HeatMapSpriteJs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, target: null };
  }

  handleShowTooltip = (node: HeatMapNode, target: TooltipData["target"]) => {
    const { showTooltip, tooltipData } = this.state;
    const datum = this.props.nodes[node.id];
    if (!datum || !datum.count) {
      this.handleHideTooltip();
    } else if (!showTooltip || tooltipData !== datum) {
      this.setState({
        showTooltip: true,
        target,
        tooltipData: datum
      });
    }
  };

  handleHideTooltip = () => {
    if (this.state.showTooltip) {
      this.setState({ showTooltip: false });
    }
  };

  handleToggleNode = (node: HeatMapNode) => {
    this.props.onToggleNode(node);
  };

  render() {
    const { nodes, xLabels, yLabels, selectedIds, fill } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    if (isEmpty(nodes)) {
      return <div className={styles.container}>-</div>;
    }
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
          <ReactResizeDetector
            handleWidth
            refreshMode="debounce"
            refreshRate={500}
          >
            {({ width }: { width: number }) => (
              <div
                className={styles.chartContainer}
                style={{
                  width: width || 0,
                  height: ((width || 0) / xLabels.length) * yLabels.length
                }}
              >
                <HeatMapSpriteJsChart
                  width={width}
                  nodes={nodes}
                  selectedIds={selectedIds}
                  rows={yLabels.length}
                  columns={xLabels.length}
                  fill={fill}
                  onToggleNode={this.handleToggleNode}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                />
              </div>
            )}
          </ReactResizeDetector>
          <Tooltip show={showTooltip} target={target} data={tooltipData}>
            {(data: HeatMapNode) => (
              <>
                <p>
                  <strong>
                    {displayDay(data.day)} {displayHour(data.hour)}
                  </strong>
                </p>
                {data.details &&
                  take(data.details, 10).map(datum => (
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

export default HeatMapSpriteJs;
