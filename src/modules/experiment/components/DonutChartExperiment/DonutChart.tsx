import React from "react";
import Measure from "react-measure";
import styles from "./DonutChart.module.scss";
import Tooltip from "../Tooltip/Tooltip";
import { TooltipData } from "../Tooltip/types";
import DonutChartChart from "./DonutChartChart";
import { DonutChartDatum } from "./types";

type Props = {
  data: Array<DonutChartDatum>;
  selectedIds: Array<string>;
  coloring?: (node: DonutChartDatum, selected: boolean) => string;
  onToggleSlice: (node: DonutChartDatum) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: DonutChartDatum | null;
};

class DonutChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, target: null };
  }

  handleShowTooltip = (
    node: DonutChartDatum,
    target: TooltipData["target"]
  ) => {
    const datum = this.props.data[node.key];
    if (!datum || !datum.value) {
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

  handleToggleSlice = (node: DonutChartDatum) => {
    this.props.onToggleSlice(node);
  };

  render() {
    const { data, selectedIds, coloring } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
    return (
      <div className={styles.container}>
        <Measure bounds>
          {({ measureRef, contentRect }) => (
            <div ref={measureRef} className={styles.chartContainer}>
              <DonutChartChart
                width={contentRect.bounds ? contentRect.bounds.width || 0 : 0}
                height={contentRect.bounds ? contentRect.bounds.height || 0 : 0}
                data={data}
                selectedIds={selectedIds}
                coloring={coloring}
                onToggleSlice={this.handleToggleSlice}
                onShowTooltip={this.handleShowTooltip}
                onHideTooltip={this.handleHideTooltip}
              />
            </div>
          )}
        </Measure>
        <Tooltip show={showTooltip} target={target} data={tooltipData}>
          {(datum: DonutChartDatum) => (
            <>
              <p>{datum.value}</p>
            </>
          )}
        </Tooltip>
      </div>
    );
  }
}

export default DonutChart;
