import React from 'react';
import type {
  DroppableStateSnapshot,
  DroppableProvided,
} from '../../../../../src/view/droppable/droppable-types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (mock = (arg: unknown) => {}) =>
  class Stubber extends React.Component<{
    provided: DroppableProvided;
    snapshot: DroppableStateSnapshot;
  }> {
    render() {
      const { provided, snapshot } = this.props;
      mock({
        provided,
        snapshot,
      });
      return (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          Hey there
          {provided.placeholder}
        </div>
      );
    }
  };
