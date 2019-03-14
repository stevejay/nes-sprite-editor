import React from "react";
import styles from "./HeatMapInteractionTracker.module.scss";
import { TooltipData } from "../Tooltip/types";

type Props = {
  columns: number;
  onTileClick: (index: number) => void;
  onShowTooltip: (data: TooltipData) => void;
  onHideTooltip: () => void;
};

type State = {
  hoverIndex: number | null;
};

class HeatMapInteractionTracker extends React.Component<Props, State> {
  _containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._containerRef = React.createRef();
    this.state = { hoverIndex: null };
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { index } = this.getInteractionData(event.clientX, event.clientY);
    this.props.onTileClick(index);
  };

  handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const data = this.getInteractionData(event.clientX, event.clientY);
    if (data.index !== this.state.hoverIndex) {
      this.setState({ hoverIndex: data.index });
      this.props.onShowTooltip(data);
    }
  };

  handleMouseLeave = () => {
    this.setState({ hoverIndex: null });
    this.props.onHideTooltip();
  };

  getInteractionData(clientX: number, clientY: number): TooltipData {
    const { columns } = this.props;
    const boundingRect = this._containerRef!.current!.getBoundingClientRect();
    const yInContainer = clientY - boundingRect.top;
    const xInContainer = clientX - boundingRect.left;
    const dimension = boundingRect.width / columns;
    const column = Math.floor(xInContainer / dimension);
    const row = Math.floor(yInContainer / dimension);
    const index = row * columns + column;
    const left = column * dimension + boundingRect.left;
    const top = row * dimension + boundingRect.top;
    return {
      index,
      originRect: { top, left, width: dimension, height: dimension }
    };
  }

  render() {
    return (
      <div
        ref={this._containerRef}
        className={styles.container}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default HeatMapInteractionTracker;
