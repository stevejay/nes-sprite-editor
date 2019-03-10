import React from "react";
import { Transition, animated } from "react-spring/renderprops";

const defaultStyles = {
  overflow: "hidden",
  width: "100%",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2em",
  fontFamily: "'Kanit', sans-serif",
  textTransform: "uppercase"
};

export default class TransitionsExample extends React.PureComponent {
  state = { items: [] };

  async componentDidMount() {
    this.t1 && clearTimeout(this.t1);
    this.t2 && clearTimeout(this.t2);
    this.t3 && clearTimeout(this.t3);

    this.setState({
      items: [{ id: "Apples" }, { id: "Oranges" }, { id: "Bananas" }]
    });
    this.t1 = setTimeout(
      () => this.setState({ items: [{ id: "Apples" }, { id: "Bananas" }] }),
      1500
    );
    this.t2 = setTimeout(
      () =>
        this.setState({
          items: [{ id: "Apples" }, { id: "Oranges" }, { id: "Bananas" }]
        }),
      3000
    );
    this.t3 = setTimeout(
      () => this.setState({ items: [{ id: "Kiwis" }] }),
      4500
    );
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "#70C1B3",
          overflow: "hidden",
          cursor: "pointer",
          margin: 0,
          padding: 0
        }}
        onClick={() => this.componentDidMount()}
      >
        <Transition
          items={this.state.items}
          keys={item => item.id}
          //initial={null}
          from={{ overflow: "hidden", height: 0 }}
          enter={{ height: 50, background: "#28d79f" }}
          leave={{ height: 0, background: "#c23369" }}
          update={{ background: "#28b4d7" }}
          // trail={200}
        >
          {item => styles => (
            <animated.div style={{ ...defaultStyles, ...styles }}>
              {item.id}
            </animated.div>
          )}
        </Transition>
      </div>
    );
  }
}
