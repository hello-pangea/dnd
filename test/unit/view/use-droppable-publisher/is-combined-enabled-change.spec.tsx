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
      <ScrollableItem isCombineEnabled />
    </WithAppContext>,
  );
  // not called yet
  expect(marshal.updateDroppableIsCombineEnabled).not.toHaveBeenCalled();

  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

  // changing to false
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled={false} />
    </WithAppContext>,
  );
  expect(marshal.updateDroppableIsCombineEnabled).toHaveBeenCalledTimes(1);
  expect(marshal.updateDroppableIsCombineEnabled).toHaveBeenCalledWith(
    preset.home.descriptor.id,
    false,
  );
  marshal.updateDroppableIsCombineEnabled.mockClear();

  // now setting to true
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled />
    </WithAppContext>,
  );
  expect(marshal.updateDroppableIsCombineEnabled).toHaveBeenCalledTimes(1);
  expect(marshal.updateDroppableIsCombineEnabled).toHaveBeenCalledWith(
    preset.home.descriptor.id,
    true,
  );
});

it('should not publish updates to the enabled state when there is no drag', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const { rerender } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled />,
    </WithAppContext>,
  );

  // not called yet
  expect(marshal.updateDroppableIsCombineEnabled).not.toHaveBeenCalled();

  // no yet dragging

  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled={false} />,
    </WithAppContext>,
  );

  expect(marshal.updateDroppableIsCombineEnabled).not.toHaveBeenCalled();
});

it('should not publish updates when there is no change', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const { rerender } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled />,
    </WithAppContext>,
  );

  // not called yet
  expect(marshal.updateDroppableIsCombineEnabled).not.toHaveBeenCalled();
  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

  // no change
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled />,
    </WithAppContext>,
  );

  expect(marshal.updateDroppableIsCombineEnabled).not.toHaveBeenCalled();
  marshal.updateDroppableIsCombineEnabled.mockReset();

  // force update
  rerender(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem isCombineEnabled />,
    </WithAppContext>,
  );
  expect(marshal.updateDroppableIsCombineEnabled).not.toHaveBeenCalled();
});
