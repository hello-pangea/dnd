import React from 'react';
import { render } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import { isDragging } from '../../util/helpers';
import App from '../../util/app';
import type { SensorAPI } from '../../../../../src/types';
import { forEachSensor, simpleLift } from '../../util/controls';

import type { Control } from '../../util/controls';

forEachSensor((control: Control) => {
  it('should not start a drag if another sensor is capturing', () => {
    const greedy = jest.fn<void, [SensorAPI]>();
    const { getByText } = render(<App sensors={[greedy]} />);
    const handle: HTMLElement = getByText('item: 0');

    const api: SensorAPI | undefined = greedy.mock.calls[0]?.[0];
    invariant(api, 'Expected function to be set');
    api.tryGetLock('0');

    // won't be able to lift as the lock is already claimed
    simpleLift(control, handle);

    expect(isDragging(handle)).toBe(false);
  });
});
