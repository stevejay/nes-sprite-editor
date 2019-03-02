import React from "react";
import styles from "./HeatMapInteractionTracker.module.scss";

type Props = {
  columnCount: number;
  onTileClick: (index: number) => void;
};

class HeatMapInteractionTracker extends React.Component<Props> {
  _containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._containerRef = React.createRef();
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { columnCount, onTileClick } = this.props;
    const boundingRect = this._containerRef!.current!.getBoundingClientRect();
    const yInContainer = event.clientY - boundingRect.top;
    const xInContainer = event.clientX - boundingRect.left;
    const dimension = boundingRect.width / columnCount;
    const index =
      Math.floor(yInContainer / dimension) * columnCount +
      Math.floor(xInContainer / dimension);
    onTileClick(index);
  };

  render() {
    return (
      <div
        ref={this._containerRef}
        className={styles.container}
        onClick={this.handleClick}

        // onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default HeatMapInteractionTracker;
