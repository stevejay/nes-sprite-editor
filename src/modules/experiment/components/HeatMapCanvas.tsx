import React from "react";
import styles from "./HeatMapCanvas.module.scss";
import { interpolateNumber } from "d3-interpolate";
import { clamp, includes } from "lodash";

const MARGIN_PX = 2;

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
  colorCallback: (
    datum: number
  ) => // , selected: boolean
  string;
};

type State = {
  dimension: number;
  height: number;
  data: Array<number>;
};

class HeatMapCanvas extends React.Component<Props, State> {
  _startingValues: Array<number>;
  _canvasRef: React.RefObject<HTMLCanvasElement>;
  _raf: any;
  _t: number;

  constructor(props: Props) {
    super(props);
    this._canvasRef = React.createRef();
    this._startingValues = new Array(props.data.length).fill(0);
    this._t = 0;
    this._raf = null;
    this.state = HeatMapCanvas.calculateState(props, this._startingValues);
  }

  componentDidMount() {
    const {
      width,
      data,
      columnCount,
      colorCallback,
      selectedIndexes
    } = this.props;
    const { height, dimension } = this.state;
    this.resizeCanvas(width, height);
    this.renderTiles(
      data,
      this._startingValues,
      selectedIndexes,
      columnCount,
      colorCallback,
      dimension
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { width, columnCount, colorCallback, selectedIndexes } = this.props;
    const { height, dimension, data } = this.state;

    if (width !== prevProps.width) {
      this.resizeCanvas(width, height);
    }

    if (data !== prevState.data) {
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }

      if (this._t >= 1) {
        // animation already finished so use old data as starting point
        this._startingValues = prevState.data.slice();
      } else {
        // animation was in progress so calculate where we'd got to and
        // use that as the starting values
        this._startingValues = this._startingValues.map((value, index) =>
          interpolateNumber(value, prevState.data[index])(this._t)
        );
      }

      this._t = 0;
    }

    if (
      data !== prevState.data ||
      width !== prevProps.width ||
      selectedIndexes !== prevProps.selectedIndexes
    ) {
      this.renderTiles(
        data,
        this._startingValues,
        selectedIndexes,
        columnCount,
        colorCallback,
        dimension
      );
    }
  }

  private renderTiles(
    data: Props["data"],
    startingValues: Array<number>,
    selectedIndexes: Array<number>,
    columnCount: Props["columnCount"],
    colorCallback: Props["colorCallback"],
    dimension: State["dimension"]
  ) {
    const canvas = this._canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; ++i) {
      const column = i % columnCount;
      const row = Math.floor(i / columnCount);
      const x = (dimension + MARGIN_PX) * column;
      const y = (dimension + MARGIN_PX) * row;

      if (includes(selectedIndexes, i)) {
        ctx.fillStyle = "#00cb8e";
      } else {
        ctx.fillStyle = colorCallback(
          interpolateNumber(startingValues[i], data[i])(this._t)
        );
      }

      drawRoundedRect(ctx, x, y, dimension, dimension, MARGIN_PX);
    }

    if (this._t >= 1) {
      // completed the animation
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      return;
    }

    this._raf = requestAnimationFrame(() => {
      this._t = clamp(this._t + 1 / (300 / 16.666), 0, 1); // 300ms
      this.renderTiles(
        data,
        this._startingValues,
        selectedIndexes,
        columnCount,
        colorCallback,
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
    const dimension = (width - MARGIN_PX * (columnCount - 1)) / columnCount;
    const rows = Math.ceil(data.length / columnCount);
    const height = dimension * rows + MARGIN_PX * (rows - 1);
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

  render() {
    return (
      <canvas ref={this._canvasRef} className={styles.canvas} role="img" />
    );
  }
}

export default HeatMapCanvas;
