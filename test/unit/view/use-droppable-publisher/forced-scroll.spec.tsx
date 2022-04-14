import { render } from '@testing-library/react';
import React from 'react';
import { invariant } from '../../../../src/invariant';
import { getMarshalStub } from '../../../util/dimension-marshal';
import { setViewport } from '../../../util/viewport';
import {
  App,
  immediate,
  smallFrameClient,
  bigClient,
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
import setDOMRect from '../../../util/set-dom-rect';

setViewport(preset.viewport);

it('should throw if the droppable has no closest scrollable', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  // no scroll parent
  const { container } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <App parentIsScrollable={false} droppableIsScrollable={false} />,
    </WithAppContext>,
  );
  const droppable = container.querySelector('.droppable') as HTMLElement;
  invariant(droppable);
  const parent = container.querySelector('.scroll-parent') as HTMLElement;
  invariant(parent);
  jest
    .spyOn(droppable, 'getBoundingClientRect')
    .mockImplementation(() => setDOMRect(smallFrameClient.borderBox));
  jest
    .spyOn(parent, 'getBoundingClientRect')
    .mockImplementation(() => setDOMRect(bigClient.borderBox));

  // validating no initial scroll
  expect(parent.scrollTop).toBe(0);
  expect(parent.scrollLeft).toBe(0);
  expect(droppable.scrollTop).toBe(0);
  expect(droppable.scrollLeft).toBe(0);

  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;
  // request the droppable start listening for scrolling
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

  // ask it to scroll
  expect(() => callbacks.scroll({ x: 100, y: 100 })).toThrow();

  // no scroll changes
  expect(parent.scrollTop).toBe(0);
  expect(parent.scrollLeft).toBe(0);
  expect(droppable.scrollTop).toBe(0);
  expect(droppable.scrollLeft).toBe(0);
});

describe('there is a closest scrollable', () => {
  it('should update the scroll of the closest scrollable', () => {
    const marshal = getMarshalStub();
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.droppable, 'register');
    const { container } = render(
      <WithAppContext marshal={marshal} registry={registry}>
        <ScrollableItem />
      </WithAppContext>,
    );
    const scrollContainer = container.querySelector(
      '.scroll-container',
    ) as HTMLElement;
    invariant(scrollContainer);

    expect(scrollContainer.scrollTop).toBe(0);
    expect(scrollContainer.scrollLeft).toBe(0);

    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;
    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

    callbacks.scroll({ x: 500, y: 1000 });

    expect(scrollContainer.scrollLeft).toBe(500);
    expect(scrollContainer.scrollTop).toBe(1000);
  });

  it('should throw if asked to scoll while scroll is not currently being watched', () => {
    const marshal = getMarshalStub();
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.droppable, 'register');
    const { container } = render(
      <WithAppContext marshal={marshal} registry={registry}>
        <ScrollableItem />
      </WithAppContext>,
    );

    const scrollContainer = container.querySelector(
      '.scroll-container',
    ) as HTMLElement;
    invariant(scrollContainer);
    expect(scrollContainer.scrollTop).toBe(0);
    expect(scrollContainer.scrollLeft).toBe(0);

    // dimension not returned yet
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;
    expect(() => callbacks.scroll({ x: 500, y: 1000 })).toThrow();

    // now watching scroll
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, immediate);

    // no longer watching scroll
    callbacks.dragStopped();
    expect(() => callbacks.scroll({ x: 500, y: 1000 })).toThrow();
  });
});
