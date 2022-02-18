import React from 'react';
import type { DroppableProvided } from '../../../../src/view/droppable/droppable-types';
import mount from './util/mount';
import { withError } from '../../../util/console';

it('should warn a consumer if they have not provided a ref', () => {
  class NoRef extends React.Component<{
    provided: DroppableProvided;
  }> {
    render() {
      const provided: DroppableProvided = this.props.provided;

      return (
        <div {...provided.droppableProps}>
          Hello there
          {provided.placeholder}
        </div>
      );
    }
  }

  withError(() => {
    mount({ WrappedComponent: NoRef });
  });
});

it('should throw a consumer if they have provided an SVGElement', () => {
  class WithSVG extends React.Component<{
    provided: DroppableProvided;
  }> {
    render() {
      const provided: DroppableProvided = this.props.provided;

      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // TypeScript is correctly stating this is not a HTMLElement
        <svg {...provided.droppableProps} ref={provided.innerRef}>
          Hello there
          {provided.placeholder}
        </svg>
      );
    }
  }

  withError(() => {
    mount({ WrappedComponent: WithSVG });
  });
});
