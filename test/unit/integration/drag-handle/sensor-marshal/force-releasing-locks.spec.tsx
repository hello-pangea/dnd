import React from 'react';
import { render } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import type { SensorAPI, PreDragActions } from '../../../../../src/types';
import App from '../../util/app';

it('should correctly state whether a lock is claimed', () => {
  const a = jest.fn<void, [SensorAPI]>();
  const b = jest.fn<void, [SensorAPI]>();
  const onForceStop = jest.fn();

  render(<App sensors={[a, b]} />);
  const first: SensorAPI | undefined = a.mock.calls[0]?.[0];
  const second: SensorAPI | undefined = b.mock.calls[0]?.[0];
  invariant(first, 'expected first to be set');
  invariant(second, 'expected second to be set');

  const preDrag: PreDragActions | null = first.tryGetLock('0', onForceStop);
  expect(preDrag).toBeTruthy();
  expect(second.isLockClaimed()).toBe(true);

  second.tryReleaseLock();
  expect(onForceStop).toHaveBeenCalled();
  // lock is gone
  expect(second.isLockClaimed()).toBe(false);
});
