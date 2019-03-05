import React from "react";
import styles from "./Tooltip.module.scss";
import { TooltipData } from "./HeatMapInteractionTracker";
import getTooltipPosition from "./get-tooltip-position";

type Props = {
  opacity?: number;
  originRect?: TooltipData["originRect"]; // relative to the viewport
  children: React.ReactNode;
};

class Tooltip extends React.Component<Props> {
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
    const { originRect } = this.props;
    if (!originRect || !this._tooltipContainer.current) {
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
      originRect.top,
      originRect.left,
      originRect.width,
      originRect.height,
      clientWidth,
      clientHeight,
      tooltipBoundingRect.width,
      tooltipBoundingRect.height,
      10
    );

    this._tooltipContainer.current.style.top = tooltipPosition.top + "px";
    this._tooltipContainer.current.style.left = tooltipPosition.left + "px";

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

export default Tooltip;
