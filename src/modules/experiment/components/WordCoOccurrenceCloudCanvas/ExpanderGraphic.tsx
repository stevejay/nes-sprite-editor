import React from "react";
import styles from "./ExpanderGraphic.module.scss";
import {
  default as d3ExpanderGraphic,
  IExpanderGraphic
} from "./d3-expander-graphic";

type Props = {
  show: boolean;
  width: number;
  height: number;
};

class ExpanderGraphic extends React.PureComponent<Props> {
  _container: React.RefObject<SVGSVGElement>;
  _renderer: IExpanderGraphic;

  constructor(props: Props) {
    super(props);
    this._container = React.createRef();
    this._renderer = d3ExpanderGraphic();
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  private renderGraph() {
    const { show, width, height } = this.props;
    if (!(width > 0)) {
      return;
    }
    this._renderer
      .containerElement(this._container.current!)
      .width(width)
      .height(height);
    this._renderer(show);
  }

  render() {
    return <svg className={styles.container} ref={this._container} />;
  }
}

export default ExpanderGraphic;
