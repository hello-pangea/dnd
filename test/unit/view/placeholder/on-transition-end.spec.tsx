import React from 'react';
import { mount } from 'enzyme';
import type { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Placeholder from './util/placeholder-with-class';
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

  const wrapper: ReactWrapper<any> = mount(
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
  // let enzyme know that the react tree has changed due to the set state
  wrapper.update();
  expectIsFull(getPlaceholderStyle(wrapper));

  // first event: a 'height' event will trigger the handler

  // not a complete event
  const height: Partial<TransitionEvent> = {
    propertyName: 'height',
  };
  wrapper.simulate('transitionend', height);
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
  wrapper.simulate('transitionend', margin);
  wrapper.simulate('transitionend', width);
  expect(onTransitionEnd).not.toHaveBeenCalled();

  // another transition event of height would trigger the handler
  wrapper.simulate('transitionend', height);
  expect(onTransitionEnd).toHaveBeenCalledTimes(1);

  // validate: this should not have triggered any close events
  expect(onClose).not.toHaveBeenCalled();
});
