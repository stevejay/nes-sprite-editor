import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring/renderprops";
import TooltipInner from "./TooltipInner";
import { TooltipData } from "./types";

// const MOUNT_CONFIG = { duration: 150, delay: 500 };
// const OTHER_CONFIG = { duration: 150 };
// const CONFIG = (_item: any, state: any) =>
//   state === "enter" ? MOUNT_CONFIG : OTHER_CONFIG;

type Props = {
  show: boolean;
  data: any;
  target: TooltipData["originRect"] | null;
  children: (data: any) => React.ReactNode;
};

// type State = {
//   isShowing: boolean;
// };

class ModelessDialog extends React.Component<Props> {
  // state = { isShowing: false };

  // static getDerivedStateFromProps(props: Props, state: State): State {
  //   if (!props.isShowing && state.isShowing) {
  //     return { isShowing: false };
  //   }
  //   if (props.isShowing && !state.isShowing) {
  //     return { isShowing: true };
  //   }
  //   return state;
  // }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.show !== this.props.show || nextProps.data !== this.props.data
    );
  }

  render() {
    const { target, children, data } = this.props;
    const { show } = this.props;
    return (
      <Transition
        config={{ duration: 50 }}
        items={show}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {show =>
          show &&
          (({ opacity }) => (
            <Portal>
              <TooltipInner opacity={opacity} target={target}>
                {children(data)}
              </TooltipInner>
            </Portal>
          ))
        }
      </Transition>
    );
  }
}

export default ModelessDialog;
