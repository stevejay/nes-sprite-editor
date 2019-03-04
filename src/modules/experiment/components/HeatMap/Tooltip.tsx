import React from "react";
import styles from "./Tooltip.module.scss";
import { Portal } from "react-portal";
import { TooltipData } from "./HeatMapInteractionTracker";
import { Transition } from "react-spring/renderprops";
import getValidTooltipPositions from "./get-valid-tooltip-positions";
import { find, isNil } from "lodash";

type Props = {
  isShowing: boolean;
  content: string | null;
  originRect?: TooltipData["originRect"]; // relative to the viewport
};

type State = {
  content: string | null;
};

class TooltipInner extends React.Component<Props, State> {
  _tooltipContainer: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._tooltipContainer = React.createRef();
    this.state = { content: props.content };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!isNil(props.content)) {
      return { content: props.content };
    }
    return state;
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

    // this._tooltipContainer.current!.style.transform = `translate(${
    //   tooltipPosition.left
    // }px, ${tooltipPosition.top}px)`;

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
    const { isShowing, opacity } = this.props;
    return (
      <div ref={this._tooltipContainer} className={styles.tooltipContainer}>
        <div className={styles.tooltip} style={{ opacity }}>
          <p>{this.state.content}</p>
          <p>Someinfoasfasdfasfasfdasfdsfsf</p>
          <p>Some more info</p>
        </div>
      </div>
    );
  }
}

class Tooltip extends React.Component<Props> {
  // _tooltipContainer: React.RefObject<HTMLDivElement>;

  // constructor(props: Props) {
  //   super(props);
  //   this._tooltipContainer = React.createRef();
  // }

  // componentDidMount() {
  //   console.log("mount");
  //   this.positionTooltip();
  // }

  // componentDidUpdate() {
  //   console.log("update");
  //   this.positionTooltip();
  // }

  // private positionTooltip() {
  //   const { originRect } = this.props;
  //   if (!originRect || !this._tooltipContainer.current) {
  //     console.log("shortcircuit", !originRect, !this._tooltipContainer.current);
  //     return;
  //   }

  //   const clientWidth = Math.max(
  //     document.documentElement.clientWidth,
  //     window.innerWidth || 0
  //   );

  //   const clientHeight = Math.max(
  //     document.documentElement.clientHeight,
  //     window.innerHeight || 0
  //   );

  //   const tooltipBoundingRect = this._tooltipContainer.current!.getBoundingClientRect();

  //   const tooltipPositions = getValidTooltipPositions(
  //     originRect!.top,
  //     originRect!.left,
  //     originRect!.width,
  //     originRect!.height,
  //     clientWidth,
  //     clientHeight,
  //     tooltipBoundingRect.width,
  //     tooltipBoundingRect.height,
  //     10
  //   );

  //   let tooltipPosition = find(tooltipPositions, x => x.fits);
  //   if (!tooltipPosition) {
  //     tooltipPosition = tooltipPositions[0];
  //   }

  //   // this._tooltipContainer.current!.style.transform = `translate(${
  //   //   tooltipPosition.left
  //   // }px, ${tooltipPosition.top}px)`;

  //   this._tooltipContainer.current!.style.top = tooltipPosition.top + "px";
  //   this._tooltipContainer.current!.style.left = tooltipPosition.left + "px";

  //   this._tooltipContainer.current!.classList.remove(
  //     "left",
  //     "right",
  //     "top",
  //     "bottom",
  //     "start",
  //     "center",
  //     "end"
  //   );

  //   this._tooltipContainer.current!.classList.add(
  //     tooltipPosition.basicPosition,
  //     tooltipPosition.arrowPosition
  //   );
  // }

  render() {
    const { content, isShowing } = this.props;
    return (
      <Transition
        config={{ duration: 150 }}
        items={isShowing}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {isShowing =>
          isShowing &&
          (({ opacity }) => (
            <Portal>
              <TooltipInner {...this.props} opacity={opacity} />
              {/* <div
                ref={this._tooltipContainer}
                className={styles.tooltipContainer}
              >
                <div className={styles.tooltip} style={{ opacity }}>
                  <p>{content}</p>
                  <p>Someinfoasfasdfasfasfdasfdsfsf</p>
                  <p>Some more info</p>
                </div>
              </div> */}
            </Portal>
          ))
        }
      </Transition>
    );

    // return (
    //   <Portal>
    //     <div ref={this._tooltipContainer} className={styles.tooltipContainer}>
    //       <div className={styles.tooltip}>
    //         <p>{content}</p>
    //         <p>Someinfoasfasdfasfasfdasfdsfsf</p>
    //         <p>Some more info</p>
    //       </div>
    //     </div>
    //   </Portal>
    // );
  }
}

export default Tooltip;
