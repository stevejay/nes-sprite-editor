import React from "react";
import styles from "./HeatMapCanvas.module.scss";
import { interpolateNumber } from "d3-interpolate";
import { clamp, includes } from "lodash";
import drawRoundedRect from "./draw-rounded-rect";

const MARGIN_PX = 1;
const ANIMATION_DURATION_FRAMES = 15;

type Props = {
  width: number;
  data: Array<number>; // values in range [0, 1]
  columnCount: number;
  selectedIndexes: Array<number>;
  colorInterpolator: (datum: number) => string;
};

type State = {
  data: Array<number>;
};

class HeatMapCanvas extends React.Component<Props, State> {
  _animatingFromValues: Array<number>;
  _canvasRef: React.RefObject<HTMLCanvasElement>;
  _rafHandle: number | null;
  _t: number; // range is [0, 1]

  constructor(props: Props) {
    super(props);
    this._canvasRef = React.createRef();
    this._animatingFromValues = new Array(props.data.length).fill(0);
    this._t = 0; // zero causes animation to kick off on mount
    this._rafHandle = null; // handle to any pending raf callback
    this.state = HeatMapCanvas.calculateState(props, this._animatingFromValues);
  }

  componentDidMount() {
    const {
      width,
      data,
      columnCount,
      colorInterpolator,
      selectedIndexes
    } = this.props;
    const height = HeatMapCanvas.calculateHeight(
      width,
      columnCount,
      data.length
    );
    this.resizeCanvas(width, height);
    if (width === 0) {
      return;
    }
    this.renderTiles(
      data,
      this._animatingFromValues,
      selectedIndexes,
      width,
      columnCount,
      colorInterpolator
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      width,
      columnCount,
      colorInterpolator,
      selectedIndexes
    } = this.props;
    const { data } = this.state;
    const height = HeatMapCanvas.calculateHeight(
      width,
      columnCount,
      data.length
    );

    // there is an active animation:
    if (this._t < 1) {
      // cancel any pending raf invocation:
      if (this._rafHandle) {
        cancelAnimationFrame(this._rafHandle);
        this._rafHandle = null;
      }
      // calculate where we've got to and use that as the starting values:
      this._animatingFromValues = this._animatingFromValues.map(
        (value, index) =>
          interpolateNumber(value, prevState.data[index])(this._t)
      );
      // reset to start of animation:
      this._t = 0;
    }

    if (width !== prevProps.width) {
      this.resizeCanvas(width, height);
    }

    // data is changing and there was no in-progress animation.
    // we need to set the animatingFromValues manually:
    if (data !== prevState.data && this._t >= 1) {
      // restart animation to get the new data showing:
      this._animatingFromValues = prevState.data.slice();
      this._t = 0;
    }

    if (
      this._t < 1 ||
      width !== prevProps.width ||
      selectedIndexes !== prevProps.selectedIndexes
    ) {
      this.renderTiles(
        data,
        this._animatingFromValues,
        selectedIndexes,
        width,
        columnCount,
        colorInterpolator
      );
    }
  }

  private renderTiles(
    data: Props["data"],
    startingValues: Array<number>,
    selectedIndexes: Array<number>,
    width: number,
    columnCount: Props["columnCount"],
    colorInterpolator: Props["colorInterpolator"],
    framesCount: number = 0
  ) {
    const dimension = HeatMapCanvas.calculateDimension(width, columnCount);
    const canvas = this._canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; ++i) {
      const column = i % columnCount;
      const row = Math.floor(i / columnCount);
      const x = dimension * column;
      const y = dimension * row;

      if (includes(selectedIndexes, i)) {
        ctx.fillStyle = "#00cb8e";
      } else {
        ctx.fillStyle = colorInterpolator(
          interpolateNumber(startingValues[i], data[i])(this._t)
        );
      }

      drawRoundedRect(
        ctx,
        x + MARGIN_PX,
        y + MARGIN_PX,
        dimension - MARGIN_PX * 2,
        dimension - MARGIN_PX * 2,
        MARGIN_PX * 2
      );
    }

    if (this._t >= 1) {
      // completed the animation
      if (this._rafHandle) {
        cancelAnimationFrame(this._rafHandle);
        this._rafHandle = null;
      }
      return;
    }

    this._rafHandle = requestAnimationFrame(() => {
      this._t = clamp(framesCount / ANIMATION_DURATION_FRAMES, 0, 1);
      this.renderTiles(
        data,
        startingValues,
        selectedIndexes,
        width,
        columnCount,
        colorInterpolator,
        framesCount + 1
      );
    });
  }

  private resizeCanvas(width: number, height: number) {
    const canvas = this._canvasRef.current!;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const deviceScale = window.devicePixelRatio;
    canvas.width = width * deviceScale;
    canvas.height = height * deviceScale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(deviceScale, deviceScale);
  }

  static calculateState({ data }: Props, currentData: State["data"]): State {
    return { data: data !== currentData ? data : currentData };
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    const newState = HeatMapCanvas.calculateState(props, state.data);
    return newState.data === state.data ? state : newState;
  }

  static calculateDimension(width: number, columnCount: number) {
    return width / columnCount;
  }

  static calculateHeight(
    width: number,
    columnCount: number,
    totalCells: number
  ) {
    const dimension = HeatMapCanvas.calculateDimension(width, columnCount);
    const rows = Math.ceil(totalCells / columnCount);
    return dimension * rows;
  }

  render() {
    return (
      <canvas ref={this._canvasRef} className={styles.canvas} role="img" />
    );
  }
}

export default HeatMapCanvas;
