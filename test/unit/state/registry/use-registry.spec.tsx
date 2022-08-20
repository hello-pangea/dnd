import React from 'react';
import { render } from '@testing-library/react';
import type { DraggableEntry } from '../../../../src/state/registry/registry-types';
import type { DraggableId } from '../../../../src/types';
import { invariant } from '../../../../src/invariant';
import { getPreset } from '../../../util/dimension';
import { getDraggableEntry } from '../../../util/registry';
import useRegistry from '../../../../src/state/registry/use-registry';

const preset = getPreset();

it('should remove any registrations', () => {
  const hook = { useRegistry };
  const useRegistrySpy = jest.spyOn(hook, 'useRegistry');
  const entry: DraggableEntry = getDraggableEntry({
    uniqueId: '1',
    dimension: preset.inHome1,
  });
  const id: DraggableId = preset.inHome1.descriptor.id;
  function App() {
    hook.useRegistry();
    return null;
  }

  const { unmount } = render(<App />);
  const result = useRegistrySpy.mock.results[0];
  invariant(result.type === 'return');
  const registry = result.value;
  invariant(registry);

  // initial registration
  registry.draggable.register(entry);
  expect(registry.draggable.exists(id)).toBe(true);

  unmount();

  // only for react 16 and 17
  if (['16', '17'].includes(`${process.env.REACT_MAJOR_VERSION}`)) {
    // still available after a unmount
    // eslint-disable-next-line jest/no-conditional-expect
    expect(registry.draggable.exists(id)).toBe(true);

    // cleared after frame
    requestAnimationFrame.step();
  }

  // registry cleared
  expect(registry.draggable.exists(id)).toBe(false);
});
