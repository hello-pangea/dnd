import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import React from 'react';
import Placeholder from '../../../../src/view/placeholder';
import { expectIsFull } from './util/expect';
import getPlaceholderStyle from './util/get-placeholder-style';
import { placeholder } from './util/data';

it('should only fire a single onClose event', () => {
  const onClose = jest.fn();
  const onTransitionEnd = jest.fn();

  const { container, rerender } = render(
    <Placeholder
      contextId="1"
      animate="none"
      placeholder={placeholder}
      onClose={onClose}
      onTransitionEnd={onTransitionEnd}
    />,
  );
  expectIsFull(getPlaceholderStyle(container));

  rerender(
    <Placeholder
      contextId="1"
      animate="close"
      placeholder={placeholder}
      onClose={onClose}
      onTransitionEnd={onTransitionEnd}
    />,
  );

  const placholder = container.querySelector(
    '[data-rfd-placeholder-context-id]',
  ) as HTMLElement;

  // not a complete event
  const height: Partial<TransitionEvent> = {
    propertyName: 'height',
  };
  fireEvent.transitionEnd(placholder, height);
  expect(onClose).toHaveBeenCalledTimes(1);
  onClose.mockClear();

  // transition events while animate="closed" of different properties will not trigger

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
  expect(onClose).not.toHaveBeenCalled();
});

it('should not fire an onClose if not closing when a transitionend occurs', () => {
  const onClose = jest.fn();
  const onTransitionEnd = jest.fn();

  const { container, rerender } = render(
    <Placeholder
      animate="none"
      contextId="1"
      placeholder={placeholder}
      onClose={onClose}
      onTransitionEnd={onTransitionEnd}
    />,
  );
  const placholder = container.querySelector(
    '[data-rfd-placeholder-context-id]',
  ) as HTMLElement;
  const assert = () => {
    // not a complete event
    const height: Partial<TransitionEvent> = {
      propertyName: 'height',
    };
    fireEvent.transitionEnd(placholder, height);
    expect(onClose).not.toHaveBeenCalled();
    onClose.mockClear();
  };

  expectIsFull(getPlaceholderStyle(container));
  assert();

  rerender(
    <Placeholder
      animate="open"
      contextId="1"
      placeholder={placeholder}
      onClose={onClose}
      onTransitionEnd={onTransitionEnd}
    />,
  );
  assert();
});
