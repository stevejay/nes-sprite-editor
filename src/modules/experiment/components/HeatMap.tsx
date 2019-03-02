import React from "react";
import Measure from "react-measure";
import styles from "./HeatMap.module.scss";
import { clamp } from "lodash";
import HeatMapCanvas from "./HeatMapCanvas";

const COLOR_CALLBACK = (datum: number) =>
  `rgba(0,150,203,${clamp(0.2 + datum * 1.0, 0, 1)})`;

type Props = {
  data: Array<number>; // values in range [0, 1]
  xLabels: Array<string>;
  yLabels: Array<string>;
  selectedIndexes: Array<number>;
  // colorCallback: (
  //   datum: number
  // ) => // , selected: boolean
  // string;
};

class HeatMap extends React.Component<Props> {
  render() {
    const { data, xLabels, yLabels, selectedIndexes } = this.props;
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
              console.log(
                "width",
                contentRect.bounds ? contentRect.bounds.width : 0
              );
              return (
                <div ref={measureRef} className={styles.chartContainer}>
                  {/* The chart {contentRect.bounds ? contentRect.bounds.width : "--"} */}
                  <HeatMapCanvas
                    width={contentRect.bounds ? contentRect.bounds.width : 0}
                    data={data}
                    selectedIndexes={selectedIndexes}
                    columnCount={xLabels.length}
                    colorCallback={COLOR_CALLBACK}
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
