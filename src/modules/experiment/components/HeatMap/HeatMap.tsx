import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import { clamp, isNil } from "lodash";
import HeatMapCanvas from "./HeatMapCanvas";
import HeatMapInteractionTracker, {
  TooltipData
} from "./HeatMapInteractionTracker";
import { Portal } from "react-portal";

const COLOR_INTERPOLATOR = (datum: number) =>
  `rgba(0,150,203,${clamp(0.2 + datum * 1.0, 0, 1)})`;

type Props = {
  data: Array<number>; // values in range [0, 1]
  xLabels: Array<string>;
  yLabels: Array<string>;
  selectedIndexes: Array<number>;
  colorInterpolator?: (datum: number) => string;
  onTileClick: (index: number) => void;
};

type State = {
  index: number | null;
  originRect?: TooltipData["originRect"];
  boundingRect?: TooltipData["boundingRect"];
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
    this.state = { index: null };
  }

  handleShowTooltip = (data: TooltipData) => {
    if (data.index !== this.state.index) {
      this.setState(data);
    }
  };

  handleHideTooltip = () => {
    this.setState({ index: null });
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
    const { index: tooltipIndex, originRect, boundingRect } = this.state;
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
            {({ measureRef, contentRect }) => {
              const width = contentRect.bounds
                ? contentRect.bounds.width || 0
                : 0;
              return (
                <div ref={measureRef} className={styles.chartContainer}>
                  <HeatMapCanvas
                    width={width}
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
                  {!isNil(tooltipIndex) && (
                    <Portal>
                      <div
                        className={styles.tooltipContainer}
                        style={{
                          top: originRect!.top,
                          left: originRect!.left + originRect!.width * 0.5
                        }}
                      >
                        <div className={styles.tooltip}>
                          <p>{data[tooltipIndex]}</p>
                          <p>Some info</p>
                          <p style={{ marginBottom: 0 }}>Some more info</p>
                        </div>
                      </div>
                    </Portal>
                  )}
                </div>
              );
            }}
          </Measure>
        </div>
      </div>
    );
  }
}

export default HeatMap;
