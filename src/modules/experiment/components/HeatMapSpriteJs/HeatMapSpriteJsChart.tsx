import React from "react";
// import * as d3 from "d3";
// import heatMapFill from "./heat-map-fill";
import styles from "./HeatMapSpriteJsChart.module.scss";
import { HeatMapNode } from "./types";
import { TooltipData } from "../Tooltip/types";
import { Scene, Sprite, Group } from "spritejs";

// import { includes, noop, isNil } from "lodash";
// import drawRoundedRect from "./draw-rounded-rect";

const MARGIN_PX = 1;
// const DURATION_MS = 500;

type Props = {
  nodes: Array<HeatMapNode>;
  selectedIds: Array<number>;
  width: number;
  rows: number;
  columns: number;
  fill?: (node: HeatMapNode, selected: boolean) => string;
  onToggleNode: (node: HeatMapNode) => void;
  onShowTooltip: (node: HeatMapNode, target: TooltipData["target"]) => void;
  onHideTooltip: () => void;
};

class HeatMapSpriteJsChart extends React.Component<Props> {
  _container: React.RefObject<HTMLCanvasElement>;
  _scene: any;
  _group: any;

  // _customBase: HTMLElement;
  // _timer: d3.Timer | null;
  // _fill: (node: HeatMapNode, selected: boolean) => string;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    // this._customBase = document.createElement("custom");
    // this._timer = null;
    // this._fill = props.fill || heatMapFill;
  }

  componentDidMount() {
    this._scene = new Scene("#paper", { resolution: "flex" });
    const layer = this._scene.layer("fglayer");
    // layer.canvas.style.backgroundColor = "#9cd470";

    console.log("nodes", this.props.nodes.length);

    // layer.append(this.props.nodes.map(_node => new Sprite()));

    this._group = new Group({ id: "the-group" });
    layer.append(this._group);

    this.props.nodes.forEach(_node => {
      const s = new Sprite();

      // s.attr({
      //   // anchor: 0.5,
      //   // pos: [0, 0],
      //   // size: [15, 15],
      //   // bgcolor: "red",
      //   // borderRadius: 5
      // });

      this._group.append(s);
    });

    this.sizeScene();
    this.draw();
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.nodes !== this.props.nodes ||
      nextProps.width !== this.props.width ||
      nextProps.selectedIds !== this.props.selectedIds
    );
  }

  componentDidUpdate(prevProps: Props) {
    console.log("width", this.props.width);
    if (this.props.width !== prevProps.width) {
      this.sizeScene();
    }
    this.draw();
  }

  sizeScene() {
    const { nodes, width, columns, rows } = this.props;
    if (!(width > 0) || !nodes) {
      return;
    }

    const dimension = width / columns;
    const height = dimension * rows;
    this._scene.viewport = [width, height];

    this._scene.updateResolution();
  }

  draw() {
    const { nodes, columns, rows } = this.props;

    const layer = this._scene.layer();

    const foo = layer.getElementById("the-group");
    console.log("layer", layer, this._group.children);
    // console.log("group", this._group);

    // return;

    const width = layer.resolution[0];
    if (!(width > 0) || !nodes) {
      return;
    }

    // const height = layer.resolution[1];

    // layer.clearContext();
    const dimension = width / columns;

    for (let i = 0; i < this._group.children.length; ++i) {
      const s = this._group.children[i];

      // const node = nodes[i];
      const x = (i % columns) * dimension + MARGIN_PX;
      const y = Math.floor(i / columns) * dimension + MARGIN_PX;
      const w = dimension - MARGIN_PX * 2;
      const h = dimension - MARGIN_PX * 2;

      s.attr({
        // anchor: 0.5,
        pos: [x, y],
        size: [w, h],
        bgcolor: "red",
        borderRadius: 5
      });

      // layer.append(s);
    }
  }

  // componentWillUnmount() {
  //   if (this._timer) {
  //     this._timer.stop();
  //   }
  //   this._timer = null;
  // }

  // handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  //   const eventData = this.getEventData(event.clientX, event.clientY);
  //   if (!eventData) {
  //     return;
  //   }
  //   this.props.onToggleNode(this.props.nodes[eventData.index]);
  // };

  // handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
  //   const eventData = this.getEventData(event.clientX, event.clientY);
  //   if (!eventData) {
  //     return;
  //   }
  //   this.props.onShowTooltip(
  //     this.props.nodes[eventData.index],
  //     eventData.target
  //   );
  // };

  // handleMouseLeave = () => {
  //   this.props.onHideTooltip();
  // };

  // getEventData(clientX: number, clientY: number) {
  //   const { rows, columns } = this.props;
  //   const boundingRect = this._container!.current!.getBoundingClientRect();
  //   const yInContainer = clientY - boundingRect.top;
  //   const xInContainer = clientX - boundingRect.left;
  //   const dimension = boundingRect.width / columns;
  //   const row = Math.floor(yInContainer / dimension);
  //   const column = Math.floor(xInContainer / dimension);
  //   if (row < 0 || row >= rows || column < 0 || column >= columns) {
  //     return null;
  //   }
  //   return {
  //     index: row * columns + column,
  //     target: {
  //       top: row * dimension + boundingRect.top,
  //       left: column * dimension + boundingRect.left,
  //       width: dimension,
  //       height: dimension
  //     }
  //   };
  // }

  // private renderHeatMap(resizing: boolean, dataChanging: boolean) {
  //   const { nodes, width, columns, rows } = this.props;
  //   if (!(width > 0) || !nodes) {
  //     return;
  //   }

  //   const dimension = width / columns;
  //   const height = dimension * rows;

  //   if (resizing) {
  //     this.resize(width, height);
  //   }

  //   if (dataChanging) {
  //     this.dataBind();
  //   }

  //   this.draw();
  // }

  // private dataBind() {
  //   const { nodes } = this.props;

  //   const join = d3
  //     .select(this._customBase)
  //     .selectAll(".tile")
  //     .data(nodes, (d: any) => d.id);

  //   join
  //     .enter()
  //     .append("custom")
  //     .attr("class", "tile")
  //     .attr("fill", d => this._fill(d, false));

  //   join
  //     .transition()
  //     .duration(DURATION_MS)
  //     .attr("fill", d => this._fill(d, false))
  //     .on("start", (_d, i) => {
  //       if (isNil(this._timer)) {
  //         this._timer = d3.timer(() => this.draw());
  //       }
  //     })
  //     // @ts-ignore
  //     .end()
  //     .then(() => {
  //       if (this._timer) {
  //         this._timer.stop();
  //         this._timer = null;
  //       }
  //     })
  //     .catch(noop);
  // }

  // private draw() {
  //   const { width, columns, selectedIds } = this.props;
  //   const dimension = width / columns;
  //   const canvas = this._container.current!;
  //   const ctx = canvas.getContext("2d")!;
  //   ctx.save();
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   d3.select(this._customBase)
  //     .selectAll<HTMLElement, HeatMapNode>(".tile")
  //     .each((d, i, nodes) => {
  //       const node = d3.select(nodes[i]);
  //       const x = (d.id % columns) * dimension + MARGIN_PX;
  //       const y = Math.floor(d.id / columns) * dimension + MARGIN_PX;
  //       const width = dimension - MARGIN_PX * 2;
  //       const height = dimension - MARGIN_PX * 2;
  //       ctx.fillStyle = includes(selectedIds, d.id)
  //         ? this._fill(d, true)
  //         : node.attr("fill");
  //       drawRoundedRect(ctx, x, y, width, height, MARGIN_PX * 4);
  //     });

  //   ctx.restore();
  // }

  // private resize(width: number, height: number) {
  //   const canvas = this._container.current!;
  //   canvas.style.width = width + "px";
  //   canvas.style.height = height + "px";

  //   const deviceScale = window.devicePixelRatio;
  //   canvas.width = width * deviceScale;
  //   canvas.height = height * deviceScale;

  //   const ctx = canvas.getContext("2d")!;
  //   ctx.scale(deviceScale, deviceScale);
  // }

  render() {
    return (
      <div id="paper">
        {/* <canvas
        ref={this._container}
        className={styles.canvas}
        role="img"
        // onClick={this.handleClick}
        // onMouseMove={this.handleMouseMove}
        // onMouseLeave={this.handleMouseLeave}
      /> */}
      </div>
    );
  }
}

export default HeatMapSpriteJsChart;
