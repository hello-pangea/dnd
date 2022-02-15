import React from 'react';
import { render } from '@testing-library/react';
import type { SensorAPI } from '../../../../../src/types';
import { mouse, touch, simpleLift } from '../../util/controls';
import type { Control } from '../../util/controls';
import { isDragging } from '../../util/helpers';
import App from '../../util/app';
import { invariant } from '../../../../../src/invariant';

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

[mouse, touch].forEach((control: Control) => {
  describe(`with: ${control.name}`, () => {
    it('should cleanup a drag if a lock is forceably released mid drag', () => {
      const sensor = jest.fn<void, [SensorAPI]>();

      const { getByText } = render(<App sensors={[sensor]} />);
      const handle: HTMLElement = getByText('item: 0');
      const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
      invariant(api);

      control.preLift(handle);

      // lock is claimed but not dragging yet
      expect(api.isLockClaimed()).toBe(true);
      expect(isDragging(handle)).toBe(false);

      api.tryReleaseLock();

      expect(isDragging(handle)).toBe(false);
      expect(api.isLockClaimed()).toBe(false);

      // a lift after a released lock can get the lock all good
      simpleLift(control, handle);
      expect(api.isLockClaimed()).toBe(true);
      expect(isDragging(handle)).toBe(true);
    });
  });
});
