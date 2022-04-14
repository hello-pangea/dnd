import { render } from '@testing-library/react';
import React from 'react';
import type { DroppableDescriptor } from '../../../../src/types';
import { preset, ScrollableItem, WithAppContext } from './util/shared';
import { setViewport } from '../../../util/viewport';
import type {
  Registry,
  DroppableEntry,
} from '../../../../src/state/registry/registry-types';
import createRegistry from '../../../../src/state/registry/create-registry';

setViewport(preset.viewport);

it('should register itself when mounting', () => {
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');

  render(
    <WithAppContext registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );

  expect(registerSpy).toHaveBeenCalledTimes(1);

  // $ExpectError: using awesome matchers
  const expected: DroppableEntry = {
    uniqueId: expect.any(String),
    descriptor: preset.home.descriptor,
    callbacks: expect.any(Object),
  };

  expect(registerSpy).toHaveBeenCalledWith(expected);
});

it('should unregister itself when unmounting', () => {
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const unregisterSpy = jest.spyOn(registry.droppable, 'unregister');

  const { unmount } = render(
    <WithAppContext registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );
  expect(registerSpy).toHaveBeenCalled();
  expect(unregisterSpy).not.toHaveBeenCalled();

  const entry = registerSpy.mock.calls[0][0];

  unmount();
  expect(unregisterSpy).toHaveBeenCalledTimes(1);
  expect(unregisterSpy).toHaveBeenCalledWith(entry);
});

it('should update its registration when a descriptor property changes', () => {
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const unregisterSpy = jest.spyOn(registry.droppable, 'unregister');

  const { rerender } = render(
    <WithAppContext registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );

  // $ExpectError: using awesome matchers
  const expectedFirst: DroppableEntry = {
    uniqueId: expect.any(String),
    descriptor: preset.home.descriptor,
    callbacks: expect.any(Object),
  };

  // asserting shape of original publish
  const first = registerSpy.mock.calls[0][0];
  expect(first).toEqual(expectedFirst);

  registerSpy.mockClear();

  // updating the index
  rerender(
    <WithAppContext registry={registry}>
      <ScrollableItem droppableId="some-new-id" />
    </WithAppContext>,
  );
  const updated: DroppableDescriptor = {
    ...preset.home.descriptor,
    id: 'some-new-id',
  };

  // old descriptor removed
  expect(unregisterSpy).toHaveBeenCalledTimes(1);
  expect(unregisterSpy).toHaveBeenCalledWith(first);

  // new descriptor added
  // $ExpectError: using awesome matchers
  const expectedSecond: DroppableEntry = {
    uniqueId: first.uniqueId,
    descriptor: updated,
    callbacks: expect.any(Object),
  };
  expect(registerSpy.mock.calls[0][0]).toEqual(expectedSecond);
});

it('should not update its registration when a descriptor property does not change on an update', () => {
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const unregisterSpy = jest.spyOn(registry.droppable, 'unregister');

  const { rerender } = render(
    <WithAppContext registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );
  expect(registerSpy).toHaveBeenCalledTimes(1);
  expect(unregisterSpy).not.toHaveBeenCalled();
  registerSpy.mockClear();

  rerender(
    <WithAppContext registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );
  expect(unregisterSpy).not.toHaveBeenCalled();
  expect(registerSpy).not.toHaveBeenCalled();
});
