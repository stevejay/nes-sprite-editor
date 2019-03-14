import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import { isNil } from "lodash";
import HeatMapCanvas from "./HeatMapCanvas";
import HeatMapInteractionTracker, {
  TooltipData
} from "./HeatMapInteractionTracker";
import Tooltip from "./Tooltip";
import ModelessDialog from "./ModelessDialog";

// const COLOR_INTERPOLATOR = (value: HeatMapEntry["value"] | null) =>
//   isNil(value)
//     ? `#343644`
//     : `rgba(0,150,203,${clamp(0.2 + value * 1.0, 0, 1)})`;

// const MIN_OPACITY = 0.075;

// const COLOR_INTERPOLATOR = (value: HeatMapEntry["value"]) => {
//   const inputRange = 1 - MISSING_VALUE;
//   const outputRange = 1 - MIN_OPACITY;
//   const output =
//     ((value - MISSING_VALUE) * outputRange) / inputRange + MIN_OPACITY;
//   return `rgba(0,150,203,${clamp(output, 0, 1)})`;
// };

export type HeatMapEntry = {
  id: number;
  count: number;
  normalisedCount: number; //  in range [0, 1]
  details: Array<{ id: string; count: number }>;
};

type Props = {
  data: Array<HeatMapEntry | null>;
  selectedIds: Array<number>;
  xLabels: Array<string>;
  yLabels: Array<string>;
  onTileClick: (index: number) => void;
};

type State = {
  showTooltip: boolean;
  originRect?: TooltipData["originRect"];
  tooltipData: HeatMapEntry["details"];
};

class HeatMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: [] };
  }

  handleShowTooltip = (data: TooltipData) => {
    const datum = this.props.data[data.index];
    if (isNil(datum)) {
      this.handleHideTooltip();
      return;
    }
    this.setState({
      showTooltip: true,
      originRect: data.originRect,
      tooltipData: datum.details
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleTileClick = (index: number) => {
    this.props.onTileClick(index);
  };

  render() {
    const { data, xLabels, yLabels, selectedIds } = this.props;
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
                  selectedIds={selectedIds}
                  rows={yLabels.length}
                  columns={xLabels.length}
                />
                <HeatMapInteractionTracker
                  columns={xLabels.length}
                  onTileClick={this.handleTileClick}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                />
                <ModelessDialog isShowing={showTooltip}>
                  <Tooltip originRect={originRect}>
                    {tooltipData.map(datum => (
                      <p key={datum.id}>
                        {datum.id}: {datum.count}
                      </p>
                    ))}
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
