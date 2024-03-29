import React from 'react';
import { render, createEvent, fireEvent } from '@testing-library/react';
import App from '../../util/app';
import { simpleLift, keyboard } from '../../util/controls';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should not prevent clicks after a drag', () => {
  // clearing any pending listeners that have leaked from other tests
  fireEvent.click(window);

  const onDragStart = jest.fn();
  const onDragEnd = jest.fn();
  const { getByText } = render(
    <App onDragStart={onDragStart} onDragEnd={onDragEnd} />,
  );
  const handle: HTMLElement = getByText('item: 0');

  simpleLift(keyboard, handle);

  // flush start timer
  jest.runOnlyPendingTimers();
  expect(onDragStart).toHaveBeenCalled();
  keyboard.drop(handle);

  const event: Event = createEvent.click(handle);
  fireEvent(handle, event);

  // click not blocked
  expect(event.defaultPrevented).toBe(false);
  expect(onDragEnd).toHaveBeenCalled();
});
