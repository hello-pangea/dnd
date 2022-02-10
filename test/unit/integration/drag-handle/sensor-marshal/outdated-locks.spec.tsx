import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { invariant } from '../../../../../src/invariant';
import type {
  SensorAPI,
  PreDragActions,
  SnapDragActions,
} from '../../../../../src/types';
import App from '../../util/app';

function noop() {}

const warn = jest.spyOn(console, 'warn').mockImplementation(noop);

afterEach(() => {
  warn.mockClear();
});

it('should not allow pre drag actions when in a dragging phase', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  const preDrag: PreDragActions | null = api.tryGetLock('0');
  invariant(preDrag);
  // it is currently active
  expect(preDrag.isActive()).toBe(true);

  const drag: SnapDragActions = preDrag.snapLift();

  // pre drag now outdated
  expect(preDrag.isActive()).toBe(false);
  preDrag.abort();
  expect(warn.mock.calls[0][0]).toEqual(
    expect.stringContaining('Cannot perform action'),
  );

  // drag is active - not aborted by preDrag
  expect(drag.isActive()).toBe(true);

  // ending drag
  warn.mockClear();
  act(() => drag.drop());
  expect(warn).not.toHaveBeenCalled();

  // preDrag is still out of date
  preDrag.abort();
  expect(warn.mock.calls[0][0]).toEqual(
    expect.stringContaining('Cannot perform action'),
  );
});

it('should not allow drag actions after a drop', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  const preDrag: PreDragActions | null = api.tryGetLock('0');
  invariant(preDrag);
  expect(preDrag.isActive()).toBe(true);

  const drag: SnapDragActions = preDrag.snapLift();
  expect(drag.isActive()).toBe(true);

  act(() => drag.cancel());

  // no longer active
  expect(drag.isActive()).toBe(false);
  expect(warn).not.toHaveBeenCalled();

  drag.moveUp();
  expect(warn.mock.calls[0][0]).toEqual(
    expect.stringContaining('Cannot perform action'),
  );
});

it('should not allow drag actions after lock lost', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  const { unmount } = render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  const preDrag: PreDragActions | null = api.tryGetLock('0');
  invariant(preDrag);
  expect(preDrag.isActive()).toBe(true);

  // will cause all lock to be lost
  unmount();

  expect(preDrag.isActive()).toBe(false);
});
