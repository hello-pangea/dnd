import React from 'react';
import { render } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import type { SensorAPI } from '../../../../../src/types';
import App from '../../util/app';

it('should allow different locks in different DragDropContexts', () => {
  const a = jest.fn<void, [SensorAPI]>();
  const b = jest.fn<void, [SensorAPI]>();

  const { getAllByText } = render(
    <React.Fragment>
      <App sensors={[a]} />
      <App sensors={[b]} />
    </React.Fragment>,
  );

  const items: HTMLElement[] = getAllByText('item: 0');
  expect(items).toHaveLength(2);
  const [inFirst, inSecond] = items;
  expect(inFirst).not.toBe(inSecond);

  // each sensor can get a different lock
  const first: SensorAPI | undefined = a.mock.calls[0]?.[0];
  const second: SensorAPI | undefined = b.mock.calls[0]?.[0];
  invariant(first, 'expected first to be set');
  invariant(second, 'expected second to be set');
  expect(first.tryGetLock('0')).toBeTruthy();
  expect(second.tryGetLock('0')).toBeTruthy();
});
