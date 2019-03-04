import React from "react";
import { Portal } from "react-portal";
import { Transition } from "react-spring/renderprops";

type Props = {
  isShowing: boolean;
  children: React.ReactElement;
};

class ModelessDialog extends React.Component<Props> {
  render() {
    const { children, isShowing } = this.props;
    return (
      <Transition
        config={{ duration: 150 }}
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
