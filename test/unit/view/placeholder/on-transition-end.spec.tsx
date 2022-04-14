import { act, render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import React from 'react';
import Placeholder from '../../../../src/view/placeholder';
import { expectIsFull } from './util/expect';
import getPlaceholderStyle from './util/get-placeholder-style';
import { placeholder } from './util/data';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should only fire a single transitionend event a single time when transitioning multiple properties', () => {
  const onTransitionEnd = jest.fn();
  const onClose = jest.fn();

  const { container } = render(
    <Placeholder
      animate="open"
      placeholder={placeholder}
      onClose={onClose}
      onTransitionEnd={onTransitionEnd}
      contextId="hey"
    />,
  );
  // finish the animate open timer
  act(() => {
    jest.runOnlyPendingTimers();
  });
  expectIsFull(getPlaceholderStyle(container));

  // first event: a 'height' event will trigger the handler

  const placholder = container.querySelector(
    '[data-rfd-placeholder-context-id]',
  ) as HTMLElement;

  // not a complete event
  const height: Partial<TransitionEvent> = {
    propertyName: 'height',
  };
  fireEvent.transitionEnd(placholder, height);
  expect(onTransitionEnd).toHaveBeenCalledTimes(1);
  onTransitionEnd.mockClear();

  // subsequent transition events will not trigger

  // not a complete event
  const margin: Partial<TransitionEvent> = {
    propertyName: 'margin',
  };
  // not a complete event
  const width: Partial<TransitionEvent> = {
    propertyName: 'width',
  };
  fireEvent.transitionEnd(placholder, margin);
  fireEvent.transitionEnd(placholder, width);
  expect(onTransitionEnd).not.toHaveBeenCalled();

  // another transition event of height would trigger the handler
  fireEvent.transitionEnd(placholder, height);
  expect(onTransitionEnd).toHaveBeenCalledTimes(1);

  // validate: this should not have triggered any close events
  expect(onClose).not.toHaveBeenCalled();
});
