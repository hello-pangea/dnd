import React from 'react';
import { render } from '@testing-library/react';
import { isDragging } from '../../util/helpers';
import App from '../../util/app';
import { forEachSensor, simpleLift } from '../../util/controls';

import type { Control } from '../../util/controls';

function getCallCount(myMock: jest.SpyInstance): number {
  return myMock.mock.calls.length;
}

forEachSensor((control: Control) => {
  it('should remove all window listeners when unmounting', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<App />);

    unmount();

    expect(getCallCount(addEventListenerSpy)).toEqual(
      getCallCount(removeEventListenerSpy),
    );
  });

  it('should remove all window listeners when unmounting mid drag', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount, getByText } = render(<App />);
    const handle: HTMLElement = getByText('item: 0');

    // mid drag
    simpleLift(control, handle);
    expect(isDragging(handle)).toEqual(true);

    unmount();

    expect(getCallCount(addEventListenerSpy)).toEqual(
      getCallCount(removeEventListenerSpy),
    );
  });
});
