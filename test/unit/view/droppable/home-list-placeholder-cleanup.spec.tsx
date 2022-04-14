import { act, render } from '@testing-library/react';
import React from 'react';
import App from './util/app';
import getStubber from './util/get-stubber';
import {
  homeOwnProps,
  isNotOverHome,
  homeAtRest,
  homePostDropAnimation,
} from './util/get-props';

// Spy Placeholder component
jest.mock('../../../../src/view/placeholder', () => jest.fn());
// eslint-disable-next-line import/newline-after-import, import/first
import _Placeholder from '../../../../src/view/placeholder';
const Placeholder = jest.mocked(_Placeholder);
const { default: OriginalPlaceholder } = jest.requireActual<{
  default: typeof _Placeholder;
}>('../../../../src/view/placeholder');

beforeEach(() => {
  Placeholder.mockImplementation((props: any) => {
    return <OriginalPlaceholder {...props} />;
  });
});

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

  expect(
    container.querySelectorAll('[data-rfd-placeholder-context-id]'),
  ).toHaveLength(1);
  expect(homePostDropAnimation.shouldAnimatePlaceholder).toBe(true);

  // finishing the animation
  act(() => {
    Placeholder.mock.calls[1][0].onClose();
  });

  // placeholder is now gone
  expect(
    container.querySelectorAll('[data-rfd-placeholder-context-id]'),
  ).toHaveLength(0);
});
