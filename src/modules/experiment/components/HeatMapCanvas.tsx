import React from "react";
import styles from "./HeatMapCanvas.module.scss";
import { interpolateNumber } from "d3-interpolate";
import { clamp, includes } from "lodash";

const MARGIN_PX = 1;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  var r = x + w;
  var b = y + h;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(r - radius, y);
  ctx.quadraticCurveTo(r, y, r, y + radius);
  ctx.lineTo(r, y + h - radius);
  ctx.quadraticCurveTo(r, b, r - radius, b);
  ctx.lineTo(x + radius, b);
  ctx.quadraticCurveTo(x, b, x, b - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

type Props = {
  width: number;
  data: Array<number>; // values in range [0, 1]
  columnCount: number;
  selectedIndexes: Array<number>;
  colorInterpolator: (datum: number) => string;
};

type State = {
  dimension: number;
  height: number;
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
    const { height, dimension } = this.state;
    this.resizeCanvas(width, height);
    if (width === 0) {
      return;
    }
    this.renderTiles(
      data,
      this._animatingFromValues,
      selectedIndexes,
      columnCount,
      colorInterpolator,
      dimension
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      width,
      columnCount,
      colorInterpolator,
      selectedIndexes
    } = this.props;
    const { height, dimension, data } = this.state;

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
      // reset to start of animation timing:
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
        columnCount,
        colorInterpolator,
        dimension
      );
    }
  }

  private renderTiles(
    data: Props["data"],
    startingValues: Array<number>,
    selectedIndexes: Array<number>,
    columnCount: Props["columnCount"],
    colorInterpolator: Props["colorInterpolator"],
    dimension: State["dimension"]
  ) {
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
      this._t = clamp(this._t + 1 / (300 / 16.666), 0, 1); // 300ms
      this.renderTiles(
        data,
        this._animatingFromValues,
        selectedIndexes,
        columnCount,
        colorInterpolator,
        dimension
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

  static calculateState(
    { width, data, columnCount }: Props,
    currentData: State["data"]
  ): State {
    const dimension = width / columnCount;
    const rows = Math.ceil(data.length / columnCount);
    const height = dimension * rows;

    return {
      dimension,
      height,
      data: data !== currentData ? data : currentData
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    const newState = HeatMapCanvas.calculateState(props, state.data);
    if (
      newState.dimension === state.dimension &&
      newState.height === state.height &&
      newState.data === state.data
    ) {
      return state;
    }
    return newState;
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
