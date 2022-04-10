import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from './util/App';
import getStubber from './util/get-stubber';
import {
  homeOwnProps,
  isNotOverHome,
  homeAtRest,
  homePostDropAnimation,
} from './util/get-props';
import Placeholder from '../../../../src/view/placeholder';

it('should not display a placeholder after a flushed drag end in the home list', async () => {
  const WrappedComponent = getStubber();
  // dropping
  const { rerender, container } = render(
    <App
      ownProps={homeOwnProps}
      mapProps={isNotOverHome}
      WrappedComponent={WrappedComponent}
    />,
  );

  expect(
    container.querySelectorAll('[data-rfd-placeholder-context-id]'),
  ).toHaveLength(1);

  rerender(
    <App
      ownProps={homeOwnProps}
      mapProps={isNotOverHome}
      WrappedComponent={WrappedComponent}
      overwriteProps={homeAtRest}
    />,
  );

  expect(
    container.querySelectorAll('[data-rfd-placeholder-context-id]'),
  ).toHaveLength(0);
});

// FIXME: YOU ARE HERE vvv
it('should animate a placeholder closed in a home list after a drag', () => {
  const WrappedComponent = getStubber();
  // dropping
  const { rerender, container } = render(
    <App
      ownProps={homeOwnProps}
      mapProps={isNotOverHome}
      WrappedComponent={WrappedComponent}
    />,
  );

  expect(
    container.querySelectorAll('[data-rfd-placeholder-context-id]'),
  ).toHaveLength(1);

  rerender(
    <App
      ownProps={homeOwnProps}
      mapProps={isNotOverHome}
      WrappedComponent={WrappedComponent}
      overwriteProps={homePostDropAnimation}
    />,
  );
  // wrapper.setProps({
  //   ...homePostDropAnimation,
  // });
  // wrapper.update();

  expect(
    container.querySelectorAll('[data-rfd-placeholder-context-id]'),
  ).toHaveLength(1);
  expect(homePostDropAnimation.shouldAnimatePlaceholder).toBe(true);

  // finishing the animation
  act(() => {
    wrapper.find(Placeholder).props().onClose();
  });

  // let the wrapper know the react tree has changed
  wrapper.update();

  // placeholder is now gone
  expect(wrapper.find(Placeholder)).toHaveLength(0);
});
