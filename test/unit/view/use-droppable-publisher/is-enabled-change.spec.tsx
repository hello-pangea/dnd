import { render } from '@testing-library/react';
import React from 'react';
import { getMarshalStub } from '../../../util/dimension-marshal';
import { setViewport } from '../../../util/viewport';
import {
  preset,
  scheduled,
  ScrollableItem,
  WithAppContext,
} from './util/shared';
import type {
  Registry,
  DroppableCallbacks,
} from '../../../../src/state/registry/registry-types';
import createRegistry from '../../../../src/state/registry/create-registry';

setViewport(preset.viewport);

it('should publish updates to the enabled state when dragging', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const { rerender } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled={false} />
    </WithAppContext>,
  );
  // not called yet
  expect(marshal.updateDroppableIsEnabled).not.toHaveBeenCalled();

  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

  const isDropDisabled = true;
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled />
    </WithAppContext>,
  );

  expect(marshal.updateDroppableIsEnabled).toHaveBeenCalledTimes(1);
  expect(marshal.updateDroppableIsEnabled).toHaveBeenCalledWith(
    preset.home.descriptor.id,
    !isDropDisabled,
  );
});

it('should not publish updates to the enabled state when there is no drag', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const { rerender } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled={false} />
    </WithAppContext>,
  );

  // not called yet
  expect(marshal.updateDroppableIsEnabled).not.toHaveBeenCalled();

  // no yet dragging

  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled />
    </WithAppContext>,
  );

  expect(marshal.updateDroppableIsEnabled).not.toHaveBeenCalled();
});

it('should not publish updates when there is no change', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const { rerender } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled={false} />
    </WithAppContext>,
  );

  // not called yet
  expect(marshal.updateDroppableIsEnabled).not.toHaveBeenCalled();
  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

  // no change
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled={false} />
    </WithAppContext>,
  );

  expect(marshal.updateDroppableIsEnabled).not.toHaveBeenCalled();
  // $ExpectError
  marshal.updateDroppableIsEnabled.mockReset();

  // force update
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isDropDisabled={false} />
    </WithAppContext>,
  );
  expect(marshal.updateDroppableIsEnabled).not.toHaveBeenCalled();
});
