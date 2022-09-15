import { render } from '@testing-library/react';
import React from 'react';
import App from './util/app';
import { homeOwnProps, isOverHome, isNotOverHome } from './util/get-props';
import type { DispatchProps } from '../../../../src/view/droppable/droppable-types';
import getMaxWindowScroll from '../../../../src/view/window/get-max-window-scroll';

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

it('should update when a placeholder animation finishes', () => {
  const dispatchProps: DispatchProps = {
    updateViewportMaxScroll: jest.fn(),
  };
  render(
    <App
      ownProps={homeOwnProps}
      mapProps={isOverHome}
      dispatchProps={dispatchProps}
      isMovementAllowed={() => true}
    />,
  );

  Placeholder.mock.calls[0][0].onTransitionEnd();

  expect(dispatchProps.updateViewportMaxScroll).toHaveBeenCalledWith({
    maxScroll: getMaxWindowScroll(),
  });
});

it('should update when a placeholder finishes and the list is not dragged over', () => {
  const dispatchProps: DispatchProps = {
    updateViewportMaxScroll: jest.fn(),
  };
  render(
    <App
      ownProps={homeOwnProps}
      mapProps={isNotOverHome}
      dispatchProps={dispatchProps}
      isMovementAllowed={() => true}
    />,
  );

  Placeholder.mock.calls[0][0].onTransitionEnd();

  expect(dispatchProps.updateViewportMaxScroll).toHaveBeenCalledWith({
    maxScroll: getMaxWindowScroll(),
  });
});

it('should not update when dropping', () => {
  const dispatchProps: DispatchProps = {
    updateViewportMaxScroll: jest.fn(),
  };
  render(
    <App
      ownProps={homeOwnProps}
      mapProps={isNotOverHome}
      dispatchProps={dispatchProps}
      // when dropping there is no movement allowed
      isMovementAllowed={() => false}
    />,
  );

  Placeholder.mock.calls[0][0].onTransitionEnd();

  expect(dispatchProps.updateViewportMaxScroll).not.toHaveBeenCalled();
});
