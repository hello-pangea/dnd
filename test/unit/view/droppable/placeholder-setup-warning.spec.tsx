import { render } from '@testing-library/react';
import React from 'react';
import type { DroppableProvided } from '../../../../src/view/droppable/droppable-types';
import {
  homeAtRest,
  foreignOwnProps,
  isOverForeign,
  isNotOverForeign,
} from './util/get-props';
import App from './util/app';
import { disableWarn } from '../../../util/console';

class WithNoPlaceholder extends React.Component<{
  provided: DroppableProvided;
}> {
  render() {
    return (
      <div
        ref={this.props.provided.innerRef}
        {...this.props.provided.droppableProps}
      >
        Not rendering placeholder
      </div>
    );
  }
}

disableWarn();

describe('is over foreign', () => {
  it('should log a warning when mounting', () => {
    const { unmount } = render(
      <App
        ownProps={foreignOwnProps}
        mapProps={isOverForeign}
        WrappedComponent={WithNoPlaceholder}
      />,
    );

    expect(console.warn).toHaveBeenCalled();

    unmount();
  });

  it('should log a warning when updating', () => {
    const { rerender, unmount } = render(
      <App
        ownProps={foreignOwnProps}
        mapProps={homeAtRest}
        WrappedComponent={WithNoPlaceholder}
      />,
    );
    expect(console.warn).not.toHaveBeenCalled();

    rerender(
      <App
        ownProps={foreignOwnProps}
        mapProps={isOverForeign}
        WrappedComponent={WithNoPlaceholder}
      />,
    );
    expect(console.warn).toHaveBeenCalled();

    unmount();
  });
});

describe('is not over foreign', () => {
  it('should not log a warning when mounting', () => {
    const { unmount } = render(
      <App
        ownProps={foreignOwnProps}
        mapProps={isNotOverForeign}
        WrappedComponent={WithNoPlaceholder}
      />,
    );

    expect(console.warn).not.toHaveBeenCalled();

    unmount();
  });

  it('should not log a warning when updating', () => {
    const { rerender, unmount } = render(
      <App
        ownProps={foreignOwnProps}
        mapProps={homeAtRest}
        WrappedComponent={WithNoPlaceholder}
      />,
    );
    expect(console.warn).not.toHaveBeenCalled();

    rerender(
      <App
        ownProps={foreignOwnProps}
        mapProps={isNotOverForeign}
        WrappedComponent={WithNoPlaceholder}
      />,
    );
    expect(console.warn).not.toHaveBeenCalled();

    unmount();
  });
});
