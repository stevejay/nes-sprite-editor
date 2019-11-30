import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring/renderprops";

// const MOUNT_CONFIG = { duration: 150, delay: 500 };
// const OTHER_CONFIG = { duration: 150 };
// const CONFIG = (_item: any, state: any) =>
//   state === "enter" ? MOUNT_CONFIG : OTHER_CONFIG;

type Props = {
  isShowing: boolean;
  children: React.ReactElement;
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

  render() {
    const { children } = this.props;
    const { isShowing } = this.props;
    return (
      <Transition
        config={{ duration: 50 }}
        items={isShowing}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {isShowing =>
          isShowing &&
          (({ opacity }) => (
            <Portal>{React.cloneElement(children, { opacity })}</Portal>
          ))
        }
      </Transition>
    );
  }
}

export default ModelessDialog;
