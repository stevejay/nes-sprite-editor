import React from "react";
import styles from "./Tooltip.module.scss";
import { TooltipData } from "./HeatMapInteractionTracker";
import getValidTooltipPositions from "./get-valid-tooltip-positions";
import { find, isNil, round } from "lodash";

type Props = {
  opacity?: number;
  data: number | null;
  originRect?: TooltipData["originRect"]; // relative to the viewport
  children: (data: number | null) => React.ReactElement;
};

type State = {
  data: Props["data"];
};

class Tooltip extends React.Component<Props, State> {
  _tooltipContainer: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._tooltipContainer = React.createRef();
    this.state = { data: props.data };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return !isNil(props.data) ? { data: props.data } : state;
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

    const tooltipPositions = getValidTooltipPositions(
      originRect!.top,
      originRect!.left,
      originRect!.width,
      originRect!.height,
      clientWidth,
      clientHeight,
      tooltipBoundingRect.width,
      tooltipBoundingRect.height,
      10
    );

    let tooltipPosition = find(tooltipPositions, x => x.fits);
    if (!tooltipPosition) {
      tooltipPosition = tooltipPositions[0];
    }

    this._tooltipContainer.current!.style.top = tooltipPosition.top + "px";
    this._tooltipContainer.current!.style.left = tooltipPosition.left + "px";

    this._tooltipContainer.current!.classList.remove(
      "left",
      "right",
      "top",
      "bottom",
      "start",
      "center",
      "end"
    );

    this._tooltipContainer.current!.classList.add(
      tooltipPosition.basicPosition,
      tooltipPosition.arrowPosition
    );
  }

  render() {
    const { opacity, children } = this.props;
    const { data } = this.state;
    return (
      <div ref={this._tooltipContainer} className={styles.tooltipContainer}>
        <div className={styles.tooltip} style={{ opacity }}>
          {children(data)}
        </div>
      </div>
    );
  }
}

export default Tooltip;
