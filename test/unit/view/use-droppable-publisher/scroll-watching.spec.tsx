import { render } from '@testing-library/react';
import React from 'react';
import type { Position } from 'css-box-model';
import { invariant } from '../../../../src/invariant';
import { getMarshalStub } from '../../../util/dimension-marshal';
import { setViewport } from '../../../util/viewport';
import {
  immediate,
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

const scroll = (el: HTMLElement, target: Position) => {
  el.scrollTop = target.y;
  el.scrollLeft = target.x;
  el.dispatchEvent(new Event('scroll'));
};

setViewport(preset.viewport);

describe('should immediately publish updates', () => {
  it('should immediately publish the scroll offset of the closest scrollable', () => {
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

    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;
    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, immediate);

    scroll(scrollContainer, { x: 500, y: 1000 });

    expect(marshal.updateDroppableScroll).toHaveBeenCalledWith(
      preset.home.descriptor.id,
      { x: 500, y: 1000 },
    );
  });

  it('should not fire a scroll if the value has not changed since the previous call', () => {
    // this can happen if you scroll backward and forward super quick
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
    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;

    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, immediate);

    // first event
    scroll(scrollContainer, { x: 500, y: 1000 });
    expect(marshal.updateDroppableScroll).toHaveBeenCalledTimes(1);
    expect(marshal.updateDroppableScroll).toHaveBeenCalledWith(
      preset.home.descriptor.id,
      { x: 500, y: 1000 },
    );
    // $ExpectError
    marshal.updateDroppableScroll.mockReset();

    // second event - scroll to same spot
    scroll(scrollContainer, { x: 500, y: 1000 });
    expect(marshal.updateDroppableScroll).not.toHaveBeenCalled();

    // third event - new value
    scroll(scrollContainer, { x: 500, y: 1001 });
    expect(marshal.updateDroppableScroll).toHaveBeenCalledWith(
      preset.home.descriptor.id,
      { x: 500, y: 1001 },
    );
  });
});

describe('should schedule publish updates', () => {
  it('should publish the scroll offset of the closest scrollable', () => {
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

    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;
    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

    scroll(scrollContainer, { x: 500, y: 1000 });
    // release the update animation frame
    requestAnimationFrame.step();

    expect(marshal.updateDroppableScroll).toHaveBeenCalledWith(
      preset.home.descriptor.id,
      { x: 500, y: 1000 },
    );
  });

  it('should throttle multiple scrolls into a animation frame', () => {
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
    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;

    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

    // first event
    scroll(scrollContainer, { x: 500, y: 1000 });
    // second event in same frame
    scroll(scrollContainer, { x: 200, y: 800 });

    // release the update animation frame
    requestAnimationFrame.step();

    expect(marshal.updateDroppableScroll).toHaveBeenCalledTimes(1);
    expect(marshal.updateDroppableScroll).toHaveBeenCalledWith(
      preset.home.descriptor.id,
      { x: 200, y: 800 },
    );

    // also checking that no loose frames are stored up
    requestAnimationFrame.flush();
    expect(marshal.updateDroppableScroll).toHaveBeenCalledTimes(1);
  });

  it('should not fire a scroll if the value has not changed since the previous frame', () => {
    // this can happen if you scroll backward and forward super quick
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
    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;

    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

    // first event
    scroll(scrollContainer, { x: 500, y: 1000 });
    // release the frame
    requestAnimationFrame.step();
    expect(marshal.updateDroppableScroll).toHaveBeenCalledTimes(1);
    expect(marshal.updateDroppableScroll).toHaveBeenCalledWith(
      preset.home.descriptor.id,
      { x: 500, y: 1000 },
    );
    // $ExpectError
    marshal.updateDroppableScroll.mockReset();

    // second event
    scroll(scrollContainer, { x: 501, y: 1001 });
    // no frame to release change yet

    // third event - back to original value
    scroll(scrollContainer, { x: 500, y: 1000 });
    // release the frame
    requestAnimationFrame.step();
    expect(marshal.updateDroppableScroll).not.toHaveBeenCalled();
  });

  it('should not publish a scroll update after requested not to update while an animation frame is occurring', () => {
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
    // tell the droppable to watch for scrolling
    const callbacks: DroppableCallbacks =
      registerSpy.mock.calls[0][0].callbacks;

    // watch scroll will only be called after the dimension is requested
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

    // first event
    scroll(scrollContainer, { x: 500, y: 1000 });
    requestAnimationFrame.step();
    expect(marshal.updateDroppableScroll).toHaveBeenCalledTimes(1);
    // $ExpectError
    marshal.updateDroppableScroll.mockReset();

    // second event
    scroll(scrollContainer, { x: 400, y: 100 });
    // no animation frame to release event fired yet

    // unwatching before frame fired
    callbacks.dragStopped();

    // flushing any frames
    requestAnimationFrame.flush();
    expect(marshal.updateDroppableScroll).not.toHaveBeenCalled();
  });
});

it('should stop watching scroll when no longer required to publish', () => {
  // this can happen if you scroll backward and forward super quick
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
  // tell the droppable to watch for scrolling
  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;

  // watch scroll will only be called after the dimension is requested
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, immediate);

  // first event
  scroll(scrollContainer, { x: 500, y: 1000 });
  expect(marshal.updateDroppableScroll).toHaveBeenCalledTimes(1);
  // $ExpectError
  marshal.updateDroppableScroll.mockReset();

  callbacks.dragStopped();

  // scroll event after no longer watching
  scroll(scrollContainer, { x: 190, y: 400 });
  expect(marshal.updateDroppableScroll).not.toHaveBeenCalled();
});

it('should stop watching for scroll events when the component is unmounted', () => {
  const consoleWarnSpy = jest
    .spyOn(console, 'warn')
    .mockImplementation(() => {});
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const { container, unmount } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );
  const scrollContainer = container.querySelector(
    '.scroll-container',
  ) as HTMLElement;
  invariant(scrollContainer);
  // tell the droppable to watch for scrolling
  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;

  // watch scroll will only be called after the dimension is requested
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, immediate);

  unmount();

  // second event - will not fire any updates
  scroll(scrollContainer, { x: 100, y: 300 });
  expect(marshal.updateDroppableScroll).not.toHaveBeenCalled();
  // also logs a warning
  expect(consoleWarnSpy).toHaveBeenCalled();
  consoleWarnSpy.mockRestore();
});

it('should throw an error if asked to watch a scroll when already listening for scroll changes', () => {
  const marshal = getMarshalStub();
  const registry: Registry = createRegistry();
  const registerSpy = jest.spyOn(registry.droppable, 'register');
  const { unmount } = render(
    <WithAppContext marshal={marshal} registry={registry}>
      <ScrollableItem />
    </WithAppContext>,
  );
  // tell the droppable to watch for scrolling
  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;

  // watch scroll will only be called after the dimension is requested
  const request = () =>
    callbacks.getDimensionAndWatchScroll(preset.windowScroll, immediate);
  request();
  expect(request).toThrow();

  // cleanup
  callbacks.dragStopped();
  unmount();
});

// if this is not the case then it will break in IE11
it('should add and remove events with the same event options', () => {
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
  const addEventListenerSpy = jest.spyOn(scrollContainer, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(
    scrollContainer,
    'removeEventListener',
  );

  // tell the droppable to watch for scrolling
  const callbacks: DroppableCallbacks = registerSpy.mock.calls[0][0].callbacks;

  // watch scroll will only be called after the dimension is requested
  callbacks.getDimensionAndWatchScroll(preset.windowScroll, scheduled);

  // assertion
  const expectedOptions = {
    passive: true,
  };
  expect(addEventListenerSpy).toHaveBeenCalledWith(
    'scroll',
    expect.any(Function),
    expectedOptions,
  );
  expect(removeEventListenerSpy).not.toHaveBeenCalled();
  addEventListenerSpy.mockReset();

  // unwatching scroll
  callbacks.dragStopped();

  // assertion
  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    'scroll',
    expect.any(Function),
    expectedOptions,
  );
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(addEventListenerSpy).not.toHaveBeenCalled();

  // cleanup
  addEventListenerSpy.mockRestore();
  removeEventListenerSpy.mockRestore();
});
