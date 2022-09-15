import { render } from '@testing-library/react';
import React from 'react';
import App from './util/app';
import getStubber from './util/get-stubber';
import {
  isNotOverHome,
  isOverHome,
  homeAtRest,
  isOverForeign,
  foreignOwnProps,
} from './util/get-props';

const getLastSnapshot = (myMock: any) => {
  return myMock.mock.calls[myMock.mock.calls.length - 1][0].snapshot;
};

it('should let a consumer know when a foreign list is being dragged over', () => {
  const myMock = jest.fn();
  const WrappedComponent = getStubber(myMock);

  render(
    <App
      ownProps={foreignOwnProps}
      mapProps={isOverForeign}
      WrappedComponent={WrappedComponent}
    />,
  );

  expect(getLastSnapshot(myMock)).toEqual(isOverForeign.snapshot);
});

it('should update snapshot as dragging over changes', () => {
  const myMock = jest.fn();
  const WrappedComponent = getStubber(myMock);

  const { rerender } = render(
    <App mapProps={homeAtRest} WrappedComponent={WrappedComponent} />,
  );
  expect(getLastSnapshot(myMock)).toBe(homeAtRest.snapshot);

  rerender(<App mapProps={isOverHome} WrappedComponent={WrappedComponent} />);
  expect(getLastSnapshot(myMock)).toBe(isOverHome.snapshot);

  // now over foreign list
  rerender(
    <App mapProps={isNotOverHome} WrappedComponent={WrappedComponent} />,
  );
  expect(getLastSnapshot(myMock)).toBe(isNotOverHome.snapshot);

  // drag is now over
  rerender(<App mapProps={homeAtRest} WrappedComponent={WrappedComponent} />);
  expect(getLastSnapshot(myMock)).toBe(homeAtRest.snapshot);
});
