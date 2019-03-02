import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import { clamp } from "lodash";
import HeatMapCanvas from "./HeatMapCanvas";
import HeatMapInteractionTracker from "./HeatMapInteractionTracker";

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

class HeatMap extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    if (props.data.length !== props.xLabels.length * props.yLabels.length) {
      throw new Error(
        "Labels need to be given for all columns and rows; " +
          "use an empty string for no label"
      );
    }
  }
  render() {
    const {
      data,
      xLabels,
      yLabels,
      selectedIndexes,
      colorInterpolator = COLOR_INTERPOLATOR,
      onTileClick
    } = this.props;
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
                  />
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
