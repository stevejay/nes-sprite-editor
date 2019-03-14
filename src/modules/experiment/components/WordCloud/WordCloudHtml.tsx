import React from "react";
import { WordCloudNode } from "./types";
import styles from "./WordCloudHtml.module.scss";
import { IWordCloudGraph, default as wordCloudGraph } from "./word-cloud-graph";

type Props = {
  nodes: Array<WordCloudNode>;
  selectedNodeIds: Array<WordCloudNode["id"]>;
  width: number;
  height: number;
  onShowTooltip: (value: WordCloudNode, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleNode: (value: WordCloudNode) => void;
};

type State = {
  nodes: Array<WordCloudNode> | null;
};

class WordCloudHtml extends React.PureComponent<Props, State> {
  _container: React.RefObject<SVGSVGElement>;
  _renderer: IWordCloudGraph;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._renderer = wordCloudGraph()
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleNodeCallback(this.handleToggleNode);
    this.state = WordCloudHtml.createState(props);
  }

  componentDidMount() {
    this.renderGraph(true);
  }

  componentDidUpdate(prevProps: Props) {
    this.renderGraph(
      this.props.nodes !== prevProps.nodes ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height
    );
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return props.nodes !== state.nodes
      ? WordCloudHtml.createState(props)
      : state;
  }

  static createState(props: Props) {
    return {
      nodes: props.nodes
    };
  }

  private handleShowTooltip = (
    value: WordCloudNode,
    originRect: ClientRect
  ) => {
    this.props.onShowTooltip(value, originRect);
  };

  private handleHideTooltip = () => {
    this.props.onHideTooltip();
  };

  private handleToggleNode = (value: WordCloudNode) => {
    this.props.onToggleNode(value);
  };

  private renderGraph(recalculateNodes: boolean) {
    const { nodes, width, height, selectedNodeIds } = this.props;
    if (!(width > 0) || !(height > 0) || !nodes) {
      return;
    }
    this._renderer
      .containerElement(this._container.current!)
      .width(width)
      .height(height);
    this._renderer(nodes, selectedNodeIds, recalculateNodes);
  }

  render() {
    return <svg className={styles.container} ref={this._container} />;
  }
}

export default WordCloudHtml;
