import React from "react";
import styles from "./CommsDataSourceC.module.scss";
import { CommsSourceNode, Margin } from "./types";
import { default as Tooltip, TooltipData } from "../Tooltip";
import ReactResizeDetector from "react-resize-detector";
import CommsDataSourceChart from "./CommsDataSourceChart";
import CommsDataSourceCanvas from "./CommsDataSourceCanvas";

type Props = {
  nodes: Array<CommsSourceNode>;
  selectedNodeIds: Array<CommsSourceNode["id"]>;
  onNodeClick: (id: CommsSourceNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: CommsSourceNode | null;
  margin: Margin | null;
};

class CommsDataSource extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showTooltip: false,
      tooltipData: null,
      target: null,
      margin: null
    };
  }

  handleShowTooltip = (
    node: CommsSourceNode,
    target: TooltipData["target"]
  ) => {
    this.setState({
      showTooltip: true,
      target: target,
      tooltipData: node
    });
  };

  handleHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (node: CommsSourceNode) => {
    this.props.onNodeClick(node.id);
  };

  handleMarginChanged = (margin: Margin) => {
    this.setState({ margin });
  };

  render() {
    const { nodes, selectedNodeIds } = this.props;
    const { showTooltip, target, tooltipData, margin } = this.state;
    return (
      <>
        <ReactResizeDetector
          handleWidth
          handleHeight
          refreshMode="debounce"
          refreshRate={500}
        >
          {({ width, height }: { width: number; height: number }) => (
            <div className={styles.container}>
              <CommsDataSourceChart
                nodes={nodes}
                width={width}
                height={height}
                onMarginChanged={this.handleMarginChanged}
              />
              <CommsDataSourceCanvas
                nodes={nodes}
                selectedNodeIds={selectedNodeIds}
                width={width}
                height={height}
                margin={margin}
                onShowTooltip={this.handleShowTooltip}
                onHideTooltip={this.handleHideTooltip}
                onToggleNode={this.handleToggleNode}
              />
            </div>
          )}
        </ReactResizeDetector>
        <Tooltip show={showTooltip} target={target} data={tooltipData}>
          {(data: CommsSourceNode) => (
            <>
              <p>'{data.text}'</p>
              <p>{data.value} comms</p>
            </>
          )}
        </Tooltip>
      </>
    );

    return <div />;
  }
}

export default CommsDataSource;
