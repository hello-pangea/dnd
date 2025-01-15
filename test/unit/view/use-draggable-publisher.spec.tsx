import { render } from '@testing-library/react';
import React, { useRef, useCallback } from 'react';
import type { Spacing, Rect } from 'css-box-model';
import { useMemo } from '../../../src/use-memo-one';
import { invariant } from '../../../src/invariant';
import useDraggablePublisher from '../../../src/view/use-draggable-publisher';
import {
  getPreset,
  getDraggableDimension,
  getComputedSpacing,
} from '../../util/dimension';
import type {
  DraggableId,
  DraggableDimension,
  DraggableDescriptor,
  DraggableOptions,
} from '../../../src/types';
import type {
  Registry,
  DraggableEntry,
  GetDraggableDimensionFn,
} from '../../../src/state/registry/registry-types';
import createRegistry from '../../../src/state/registry/create-registry';
import setDOMRect from '../../util/set-dom-rect';
import { disableWarn } from '../../util/console';

const preset = getPreset();
const noComputedSpacing = getComputedSpacing({});

interface ItemProps {
  index?: number;
  draggableId?: DraggableId;
  registry: Registry;
}

const defaultOptions: DraggableOptions = {
  canDragInteractiveElements: false,
  shouldRespectForcePress: false,
  isEnabled: true,
};

function Item(props: ItemProps) {
  const {
    registry,
    draggableId = preset.inHome1.descriptor.id,
    index = preset.inHome1.descriptor.index,
  } = props;
  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback((value: HTMLElement | null = null) => {
    ref.current = value;
  }, []);
  const getRef = useCallback((): HTMLElement | null => ref.current, []);
  const descriptor: DraggableDescriptor = useMemo(
    () => ({
      id: draggableId,
      index,
      type: preset.inHome1.descriptor.type,
      droppableId: preset.inHome1.descriptor.droppableId,
    }),
    [draggableId, index],
  );

  useDraggablePublisher({
    descriptor,
    getDraggableRef: getRef,
    registry,
    ...defaultOptions,
  });

  return <div ref={setRef}>hi</div>;
}

disableWarn();

describe('dimension registration', () => {
  it('should register itself when mounting', () => {
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');
    render(<Item registry={registry} />);

    const expected: DraggableEntry = {
      // $ExpectError
      uniqueId: expect.any(String),
      descriptor: preset.inHome1.descriptor,
      options: defaultOptions,
      // $ExpectError
      getDimension: expect.any(Function),
    };
    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(expected);
  });

  it('should unregister itself when unmounting', () => {
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');
    const unregisterSpy = jest.spyOn(registry.draggable, 'unregister');
    const { unmount } = render(<Item registry={registry} />);

    const expected: DraggableEntry = {
      // $ExpectError
      uniqueId: expect.any(String),
      descriptor: preset.inHome1.descriptor,
      options: defaultOptions,
      // $ExpectError
      getDimension: expect.any(Function),
    };

    expect(unregisterSpy).not.toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(expected);
    const entry = registerSpy.mock.calls[0][0];
    expect(entry).toEqual(expected);

    unmount();
    expect(unregisterSpy).toHaveBeenCalledTimes(1);
    expect(unregisterSpy.mock.calls[0][0]).toBe(entry);
  });

  it('should update its registration when a descriptor property changes', () => {
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');
    const updateSpy = jest.spyOn(registry.draggable, 'update');
    const unregisterSpy = jest.spyOn(registry.draggable, 'unregister');
    const { rerender } = render(<Item registry={registry} />);

    const expectedInitial: DraggableEntry = {
      // $ExpectError
      uniqueId: expect.any(String),
      descriptor: preset.inHome1.descriptor,
      options: defaultOptions,
      // $ExpectError
      getDimension: expect.any(Function),
    };

    // asserting shape of original publish
    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(expectedInitial);
    const entry = registerSpy.mock.calls[0][0];
    expect(entry).toEqual(expectedInitial);

    expect(updateSpy).not.toHaveBeenCalled();
    expect(unregisterSpy).not.toHaveBeenCalled();

    registerSpy.mockReset();

    // updating the index
    rerender(<Item index={1000} registry={registry} />);

    // Descriptor updated
    const expectedUpdate: DraggableEntry = {
      uniqueId: entry.uniqueId,
      descriptor: {
        ...preset.inHome1.descriptor,
        index: 1000,
      },
      options: defaultOptions,
      // $ExpectError
      getDimension: expect.any(Function),
    };
    expect(updateSpy).toHaveBeenCalledTimes(1);
    // new descriptor
    expect(updateSpy.mock.calls[0][0]).toEqual(expectedUpdate);
    // late reference: same reference
    expect(updateSpy.mock.calls[0][1]).toBe(entry);

    // Nothing else changed
    expect(registerSpy).not.toHaveBeenCalled();
    expect(unregisterSpy).not.toHaveBeenCalled();
  });

  it('should not update its registration when a descriptor property does not change on an update', () => {
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');
    const updateSpy = jest.spyOn(registry.draggable, 'update');
    const { rerender } = render(<Item registry={registry} />);

    expect(registerSpy).toHaveBeenCalledTimes(1);

    rerender(<Item registry={registry} />);
    expect(updateSpy).not.toHaveBeenCalled();
  });
});

describe('dimension publishing', () => {
  // we are doing this rather than spying on the prototype.
  // Sometimes setRef was being provided with an element that did not have the mocked prototype :|
  const setBoundingClientRect = (element: Element | null, borderBox: Rect) => {
    invariant(element);

    element.getBoundingClientRect = () => setDOMRect(borderBox);
  };

  it('should publish the dimensions of the target when requested', () => {
    const expected: DraggableDimension = getDraggableDimension({
      descriptor: {
        id: 'fake-id',
        droppableId: preset.home.descriptor.id,
        type: preset.home.descriptor.type,
        index: 10,
      },
      borderBox: {
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
      },
    });
    jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => noComputedSpacing);
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');

    const { container } = render(
      <Item
        registry={registry}
        draggableId={expected.descriptor.id}
        index={expected.descriptor.index}
      />,
    );

    setBoundingClientRect(
      container.firstElementChild,
      expected.client.borderBox,
    );

    // pull the get dimension function out
    const getDimension: GetDraggableDimensionFn =
      registerSpy.mock.calls[0][0].getDimension;
    // execute it to get the dimension
    const result: DraggableDimension = getDimension({ x: 0, y: 0 });

    expect(result).toEqual(expected);
  });

  it('should consider any margins when calculating dimensions', () => {
    const margin: Spacing = {
      top: 10,
      right: 30,
      bottom: 40,
      left: 50,
    };
    const expected: DraggableDimension = getDraggableDimension({
      descriptor: {
        id: 'fake-id',
        droppableId: preset.home.descriptor.id,
        type: preset.home.descriptor.type,
        index: 10,
      },
      borderBox: {
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
      },
      margin,
    });
    jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => getComputedSpacing({ margin }));
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');

    const { container } = render(
      <Item
        registry={registry}
        draggableId={expected.descriptor.id}
        index={expected.descriptor.index}
      />,
    );

    setBoundingClientRect(
      container.firstElementChild,
      expected.client.borderBox,
    );

    // pull the get dimension function out
    const getDimension: GetDraggableDimensionFn =
      registerSpy.mock.calls[0][0].getDimension;
    // execute it to get the dimension
    const result: DraggableDimension = getDimension({ x: 0, y: 0 });

    expect(result).toEqual(expected);
  });

  it('should consider the window scroll when calculating dimensions', () => {
    const expected: DraggableDimension = getDraggableDimension({
      descriptor: {
        id: 'fake-id',
        droppableId: preset.home.descriptor.id,
        type: preset.home.descriptor.type,
        index: 10,
      },
      borderBox: {
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
      },
      windowScroll: preset.windowScroll,
    });
    jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => noComputedSpacing);
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');

    const { container } = render(
      <Item
        draggableId={expected.descriptor.id}
        index={expected.descriptor.index}
        registry={registry}
      />,
    );

    setBoundingClientRect(
      container.firstElementChild,
      expected.client.borderBox,
    );

    // pull the get dimension function out
    const getDimension: GetDraggableDimensionFn =
      registerSpy.mock.calls[0][0].getDimension;
    // execute it to get the dimension
    const result: DraggableDimension = getDimension(preset.windowScroll);

    expect(result).toEqual(expected);
  });

  it('should throw an error if no ref is provided when attempting to get a dimension', () => {
    function NoRefItem(props: ItemProps) {
      const {
        registry,
        draggableId = preset.inHome1.descriptor.id,
        index = preset.inHome1.descriptor.index,
      } = props;
      const ref = useRef<HTMLElement | null>(null);
      const getRef = useCallback((): HTMLElement | null => ref.current, []);
      const descriptor: DraggableDescriptor = useMemo(
        () => ({
          id: draggableId,
          index,
          type: preset.inHome1.descriptor.type,
          droppableId: preset.inHome1.descriptor.droppableId,
        }),
        [draggableId, index],
      );

      useDraggablePublisher({
        descriptor,
        getDraggableRef: getRef,
        registry,
        ...defaultOptions,
      });

      // No ref
      return <div>hi</div>;
    }
    const registry: Registry = createRegistry();
    const registerSpy = jest.spyOn(registry.draggable, 'register');
    const { unmount } = render(
      <NoRefItem registry={registry} draggableId="draggable" />,
    );
    // pull the get dimension function out
    const getDimension: GetDraggableDimensionFn =
      registerSpy.mock.calls[0][0].getDimension;
    // when we call the get dimension function without a ref things will explode
    expect(getDimension).toThrow();
    unmount();
  });
});
