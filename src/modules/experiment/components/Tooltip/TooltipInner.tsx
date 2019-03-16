import React from "react";
import styles from "./TooltipInner.module.scss";
import { floor } from "lodash";
import getTooltipPosition from "./get-tooltip-position";
import { TooltipData } from "./types";

/* <Tooltip show={showTooltip} data={tooltipData} target={target}>
  {(data: WordCloudNode) => (
    <p>
      {data.value} {data.value === 0 ? "occurrence" : "occurrences"}
    </p>
  )}
</Tooltip> */

type Props = {
  opacity?: number;
  target: TooltipData["target"] | null; // relative to the viewport
  children: React.ReactNode;
};

class TooltipInner extends React.Component<Props> {
  _tooltipContainer: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._tooltipContainer = React.createRef();
  }

  componentDidMount() {
    this.positionTooltip();
  }

  componentDidUpdate() {
    this.positionTooltip();
  }

  private positionTooltip() {
    const { target } = this.props;
    if (!target || !this._tooltipContainer.current) {
      return;
    }

    const clientWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    const clientHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const tooltipBoundingRect = this._tooltipContainer.current!.getBoundingClientRect();

    const tooltipPosition = getTooltipPosition(
      target.top,
      target.left,
      target.width,
      target.height,
      clientWidth,
      clientHeight,
      tooltipBoundingRect.width,
      tooltipBoundingRect.height,
      10
    );

    // these are rounded down as Chrome has occasional rendering
    // glitches with fixed positioning by non-integer values:
    this._tooltipContainer.current.style.top =
      floor(tooltipPosition.top) + "px";
    this._tooltipContainer.current.style.left =
      floor(tooltipPosition.left) + "px";

    this._tooltipContainer.current.classList.remove(
      "left",
      "right",
      "top",
      "bottom",
      "start",
      "center",
      "end"
    );

    this._tooltipContainer.current.classList.add(
      tooltipPosition.basicPosition,
      tooltipPosition.arrowPosition
    );
  }

  render() {
    const { opacity, children } = this.props;
    return (
      <div ref={this._tooltipContainer} className={styles.tooltipContainer}>
        <div className={styles.tooltip} style={{ opacity }}>
          {children}
        </div>
      </div>
    );
  }
}

export default TooltipInner;
