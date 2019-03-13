import React from "react";
import styles from "../WordCloud/WordCloudHtml.module.scss";
import { cloneDeep, isNil } from "lodash";
import { WordCloudNode } from "../WordCloud/types";
import cooccurrenceWordCloudGraph, {
  ICooccurrenceWordCloudGraph
} from "./cooccurrence-word-cloud-graph";

type Props = {
  nodes: Array<WordCloudNode>;
  withNodes: Array<WordCloudNode>;
  sourceNodeId: WordCloudNode["id"] | null;
  withNodeIds: Array<WordCloudNode["id"]>;
  width: number;
  height: number;
  onShowTooltip: (value: WordCloudNode, originRect: ClientRect) => void;
  onHideTooltip: () => void;
  onToggleSourceNode: (value: WordCloudNode) => void;
  onToggleWithNode: (value: WordCloudNode) => void;
};

type State = {
  nodes: Array<WordCloudNode>;
  withNodes: Array<WordCloudNode>;
};

class CooccurrenceWordCloudHtml extends React.PureComponent<Props, State> {
  _container: React.RefObject<SVGSVGElement>;
  _renderer: ICooccurrenceWordCloudGraph;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._renderer = cooccurrenceWordCloudGraph()
      .showTooltipCallback(this.handleShowTooltip)
      .hideTooltipCallback(this.handleHideTooltip)
      .toggleSourceNodeCallback(this.handleToggleSourceNode)
      .toggleWithNodeCallback(this.handleToggleWithNode);
    this.state = CooccurrenceWordCloudHtml.createState(props);
  }

  componentDidMount() {
    this.renderGraph(true, true);
  }

  componentDidUpdate(prevProps: Props) {
    this.renderGraph(
      this.props.nodes !== prevProps.nodes ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height ||
        (!isNil(this.props.sourceNodeId) && isNil(prevProps.sourceNodeId)) ||
        (isNil(this.props.sourceNodeId) && !isNil(prevProps.sourceNodeId)),
      this.props.withNodes !== prevProps.withNodes ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height ||
        this.props.sourceNodeId !== prevProps.sourceNodeId
    );
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return props.nodes !== state.nodes || props.withNodes !== state.withNodes
      ? CooccurrenceWordCloudHtml.createState(props)
      : state;
  }

  static createState(props: Props) {
    return {
      nodes: props.nodes,
      withNodes: props.withNodes
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

  private handleToggleSourceNode = (value: WordCloudNode) => {
    this.props.onToggleSourceNode(value);
  };

  private handleToggleWithNode = (value: WordCloudNode) => {
    this.props.onToggleWithNode(value);
  };

  private renderGraph(
    recalculateNodes: boolean,
    recalculateWithNodes: boolean
  ) {
    const {
      nodes,
      withNodes,
      width,
      height,
      sourceNodeId,
      withNodeIds
    } = this.props;
    if (!(width > 0) || !(height > 0)) {
      return;
    }
    this._renderer
      .containerElement(this._container.current!)
      .width(width)
      .height(height);
    this._renderer(
      nodes,
      withNodes,
      sourceNodeId,
      withNodeIds,
      recalculateNodes,
      recalculateWithNodes
    );
  }

  render() {
    return <svg className={styles.container} ref={this._container} />;
  }
}

export default CooccurrenceWordCloudHtml;
