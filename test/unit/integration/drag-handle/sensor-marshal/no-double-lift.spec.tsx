import React from 'react';
import { render } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import type {
  SensorAPI,
  PreDragActions,
  SnapDragActions,
} from '../../../../../src/types';
import App from '../../util/app';

it('should not allow double lifting', () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, 'expected api to be set');

  const preDrag: PreDragActions | undefined | null = api.tryGetLock('0');
  invariant(preDrag);
  // it is currently active
  expect(preDrag.isActive()).toBe(true);

  const drag: SnapDragActions = preDrag.snapLift();

  expect(() => preDrag.fluidLift({ x: 0, y: 0 })).toThrow();
  // original lock is gone
  expect(drag.isActive()).toBe(false);

  // yolo
  expect(() => preDrag.snapLift()).toThrow();
});
