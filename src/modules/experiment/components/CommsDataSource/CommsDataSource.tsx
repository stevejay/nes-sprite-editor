import React from "react";
import styles from "./CommsDataSource.module.scss";
import { CommsSourceNode } from "./types";
import { default as Tooltip, TooltipData } from "../Tooltip";
import ReactResizeDetector from "react-resize-detector";
import CommsDataSourceChart from "./CommsDataSourceChart";

type Props = {
  nodes: Array<CommsSourceNode>;
  selectedIds: Array<CommsSourceNode["id"]>;
  onNodeClick: (id: CommsSourceNode["id"]) => void;
};

type State = {
  showTooltip: boolean;
  target: TooltipData["target"] | null;
  tooltipData: CommsSourceNode | null;
};

class CommsDataSource extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTooltip: false, tooltipData: null, target: null };
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

  handleHideTooltip = (_node: CommsSourceNode) => {
    this.setState({ showTooltip: false });
  };

  handleToggleNode = (node: CommsSourceNode) => {
    this.props.onNodeClick(node.id);
  };

  render() {
    const { nodes, selectedIds } = this.props;
    const { showTooltip, target, tooltipData } = this.state;
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
                selectedIds={selectedIds}
                width={width}
                height={height}
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
