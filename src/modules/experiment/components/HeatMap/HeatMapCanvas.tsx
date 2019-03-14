import React from "react";
import * as d3 from "d3";
import styles from "./HeatMapCanvas.module.scss";
import { clamp, includes, isNil, range } from "lodash";
import drawRoundedRect from "./draw-rounded-rect";
import { HeatMapEntry } from "./HeatMap";

const MARGIN_PX = 1;
const NO_VALUE_OPACITY = 0.075;
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;
const DURATION = 250;
const EASE = d3.easeLinear; // d3.easeCubic;
export const MISSING_VALUE = -0.25;

type D3HeatMapEntry = {
  opacity: number;
  sOpacity: number;
  tOpacity: number;
  selected: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Props = {
  width: number;
  data: Array<HeatMapEntry | null>; // values in range [0, 1]
  rows: number;
  columns: number;
  selectedIds: Array<number>;
};

class HeatMapCanvas extends React.PureComponent<Props> {
  _canvasRef: React.RefObject<HTMLCanvasElement>;
  _timer: d3.Timer | null;
  _data: Array<D3HeatMapEntry>;
  _opacity: d3.ScaleLinear<number, number>;

  constructor(props: Props) {
    super(props);
    this._canvasRef = React.createRef();
    this._timer = null;
    this._data = this.initialize();
    this._opacity = d3
      .scaleLinear()
      .range([MIN_OPACITY, MAX_OPACITY])
      .domain([0, 1]);
  }

  componentDidMount() {
    const { width, rows, columns } = this.props;
    const height = HeatMapCanvas.calculateHeight(width, rows, columns);
    this.resizeCanvas(width, height);
    if (width === 0) {
      return;
    }
    this.update();
  }

  componentDidUpdate(prevProps: Props) {
    const { width, rows, columns } = this.props;
    const height = HeatMapCanvas.calculateHeight(width, rows, columns);
    if (width !== prevProps.width) {
      this.resizeCanvas(width, height);
    }
    this.update();
  }

  private initialize(): Array<D3HeatMapEntry> {
    const { rows, columns } = this.props;
    return range(0, rows * columns).map(() => ({
      opacity: NO_VALUE_OPACITY,
      sOpacity: NO_VALUE_OPACITY,
      tOpacity: NO_VALUE_OPACITY,
      selected: false,
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }));
  }

  private update() {
    const { data, selectedIds, width, columns } = this.props;
    const dimension = HeatMapCanvas.calculateDimension(width, columns);
    let animate = false;

    this._data.forEach((datum, index) => {
      const newDatum = data[index];
      const column = index % columns;
      const row = Math.floor(index / columns);
      const selected = includes(selectedIds, index);

      datum.x = dimension * column + MARGIN_PX;
      datum.y = dimension * row + MARGIN_PX;
      datum.w = dimension - MARGIN_PX * 2;
      datum.h = dimension - MARGIN_PX * 2;
      datum.selected = selected;
      datum.sOpacity = datum.opacity;
      datum.tOpacity = isNil(newDatum)
        ? NO_VALUE_OPACITY
        : selected
        ? datum.sOpacity
        : this._opacity(newDatum.normalisedCount);

      if (datum.tOpacity !== datum.sOpacity) {
        animate = true;
      }
    });

    if (animate) {
      if (this._timer) {
        this._timer.restart(this.timerCallback);
      } else {
        this._timer = d3.timer(this.timerCallback);
      }
    } else {
      this.draw();
    }
  }

  private timerCallback = (elapsed: number) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, EASE(elapsed / DURATION));
    this._data.forEach(d => {
      d.opacity = d.sOpacity * (1 - t) + d.tOpacity * t;
    });
    this.draw();
    if (t === 1 && this._timer) {
      this._timer.stop();
      this._timer = null;
    }
  };

  private draw() {
    const canvas = this._canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this._data.length; ++i) {
      const d = this._data[i];
      ctx.fillStyle = d.selected
        ? "#00cb8e"
        : `rgba(0,150,203,${clamp(d.opacity, 0, 1)})`;
      drawRoundedRect(ctx, d.x, d.y, d.w, d.h, MARGIN_PX * 4);
    }

    ctx.restore();
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

  static calculateDimension(width: number, columns: number) {
    return width / columns;
  }

  static calculateHeight(width: number, rows: number, columns: number) {
    const dimension = HeatMapCanvas.calculateDimension(width, columns);
    return dimension * rows;
  }

  render() {
    return (
      <canvas ref={this._canvasRef} className={styles.canvas} role="img" />
    );
  }
}

export default HeatMapCanvas;
