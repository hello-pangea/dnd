import React from 'react';
import { render } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import type { SensorAPI, PreDragActions } from '../../../../../src/types';
import App from '../../util/app';

it('should correctly state whether a lock is claimed', () => {
  const a = jest.fn<void, [SensorAPI]>();
  const b = jest.fn<void, [SensorAPI]>();

  render(<App sensors={[a, b]} />);
  const first: SensorAPI | undefined = a.mock.calls[0]?.[0];
  const second: SensorAPI | undefined = b.mock.calls[0]?.[0];
  invariant(first, 'expected first to be set');
  invariant(second, 'expected second to be set');

  // both sensors know that the lock is not claimed
  expect(first.isLockClaimed()).toBe(false);
  expect(second.isLockClaimed()).toBe(false);

  const preDrag: PreDragActions | null = first.tryGetLock('0');
  expect(preDrag).toBeTruthy();

  // both sensors can know if the lock is claimed
  expect(first.isLockClaimed()).toBe(true);
  expect(second.isLockClaimed()).toBe(true);
});
