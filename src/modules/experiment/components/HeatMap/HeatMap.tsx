import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import { clamp, isNil, round } from "lodash";
import HeatMapCanvas from "./HeatMapCanvas";
import HeatMapInteractionTracker, {
  TooltipData
} from "./HeatMapInteractionTracker";
import Tooltip from "./Tooltip";
import ModelessDialog from "./ModelessDialog";

const COLOR_INTERPOLATOR = (datum: number) =>
  `rgba(0,150,203,${clamp(0.2 + datum * 1.0, 0, 1)})`;

// TODO selectedIndexes should be selectedIds

type Props = {
  data: Array<number>; // values in range [0, 1]
  xLabels: Array<string>;
  yLabels: Array<string>;
  selectedIndexes: Array<number>;
  colorInterpolator?: (datum: number) => string;
  onTileClick: (index: number) => void;
};

type State = {
  showTooltip: boolean;
  originRect?: TooltipData["originRect"];
  tooltipData: number;
};

class HeatMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.data.length !== props.xLabels.length * props.yLabels.length) {
      throw new Error(
        "Labels need to be given for all columns and rows; " +
          "use an empty string for no label"
      );
    }
    this.state = { showTooltip: false, tooltipData: -1 };
  }

  handleShowTooltip = (data: TooltipData) => {
    this.setState({
      showTooltip: true,
      originRect: data.originRect,
      tooltipData: this.props.data[data.index]
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  render() {
    const {
      data,
      xLabels,
      yLabels,
      selectedIndexes,
      colorInterpolator = COLOR_INTERPOLATOR,
      onTileClick
    } = this.props;
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
                <HeatMapCanvas
                  width={contentRect.bounds ? contentRect.bounds.width || 0 : 0}
                  data={data}
                  selectedIndexes={selectedIndexes}
                  columnCount={xLabels.length}
                  colorInterpolator={colorInterpolator}
                />
                <HeatMapInteractionTracker
                  columnCount={xLabels.length}
                  onTileClick={onTileClick}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                />
                <ModelessDialog isShowing={showTooltip}>
                  <Tooltip originRect={originRect}>
                    <p>{round(tooltipData, 4)}</p>
                    <p>Some info</p>
                    <p>Some more info 2</p>
                  </Tooltip>
                </ModelessDialog>
              </div>
            )}
          </Measure>
        </div>
      </div>
    );
  }
}

export default HeatMap;
