import React from 'react';
import { render, act } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import type {
  SensorAPI,
  PreDragActions,
  FluidDragActions,
  SnapDragActions,
} from '../../../../../src/types';
import App from '../../util/app';
import { isDragging, isDropAnimating } from '../../util/helpers';

function noop() {}

it('should allow an exclusive lock for drag actions', () => {
  const a = jest.fn<void, [SensorAPI]>();
  const b = jest.fn<void, [SensorAPI]>();

  render(<App sensors={[a, b]} />);
  const first: SensorAPI | undefined = a.mock.calls[0]?.[0];
  const second: SensorAPI | undefined = b.mock.calls[0]?.[0];
  invariant(first, 'expected first to be set');
  invariant(second, 'expected second to be set');

  // first can get a lock
  expect(first.tryGetLock('0')).toBeTruthy();

  // second cannot get a lock
  expect(second.tryGetLock('0')).toBe(null);

  // first cannot get another lock on the same element
  expect(first.tryGetLock('0')).toBe(null);

  // nothing cannot get lock on a different element
  expect(first.tryGetLock('1')).toBe(null);
  expect(second.tryGetLock('1')).toBe(null);
});

it('should allow a lock to be released', () => {
  const sensor = jest.fn<void, [SensorAPI]>();

  render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  Array.from({ length: 4 }).forEach(() => {
    // get the lock
    const lock: PreDragActions | null = api.tryGetLock('0', noop);
    expect(lock).toBeTruthy();
    invariant(lock, 'Expected lock to be set');

    // cannot get another lock
    expect(api.tryGetLock('0')).toBe(null);

    // release the lock
    lock.abort();
  });
});

it('should not allow a sensor to obtain a on a dropping item, but can claim one on something else while dragging', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  const { getByText } = render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');
  const handle: HTMLElement = getByText('item: 0');

  const preDrag: PreDragActions | null = api.tryGetLock('0', noop);
  invariant(preDrag, 'Expected to get lock');

  // drag not started yet
  expect(isDragging(handle)).toBe(false);
  // start a drag
  const actions: FluidDragActions = preDrag.fluidLift({ x: 0, y: 0 });
  expect(isDragging(handle)).toBe(true);

  // release the movement
  actions.move({ x: 100, y: 100 });
  requestAnimationFrame.flush();

  actions.drop();
  expect(isDropAnimating(handle)).toBe(true);

  // lock is no longer active
  expect(actions.isActive()).toBe(false);
  expect(preDrag.isActive()).toBe(false);

  // cannot get a new lock while still dropping
  expect(api.tryGetLock('0', noop)).toBe(null);

  // can get a lock on a handle that is not dropping - while the other is dropping
  expect(api.tryGetLock('1', noop)).toBeTruthy();
});

it('should release a lock when aborting a pre drag', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  const preDrag: PreDragActions | null = api.tryGetLock('0', noop);
  invariant(preDrag, 'Expected to get lock');
  expect(preDrag.isActive()).toBe(true);
  // should release the lock
  preDrag.abort();
  expect(preDrag.isActive()).toBe(false);

  // can get another lock
  const second: PreDragActions | null = api.tryGetLock('1', noop);
  expect(second).toBeTruthy();
  invariant(second);
  // need to release this one :)
  second.abort();
  expect(second.isActive()).toBe(false);
});

it('should release a lock when cancelling or dropping a drag', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  (['cancel', 'drop'] as const).forEach((property) => {
    const preDrag: PreDragActions | null = api.tryGetLock('0', noop);
    invariant(preDrag, 'Expected to get lock');
    expect(preDrag.isActive()).toBe(true);

    const drag: SnapDragActions = preDrag.snapLift();
    expect(drag.isActive()).toBe(true);

    // cannot get another lock
    const second: PreDragActions | null = api.tryGetLock('1', noop);
    expect(second).toBe(null);

    // calling cancel or drop
    act(() => {
      drag[property]();
    });

    // can now get another lock
    const third: PreDragActions | null = api.tryGetLock('1', noop);
    expect(third).toBeTruthy();
    // need to try to release it
    invariant(third);
    third.abort();
  });
});
