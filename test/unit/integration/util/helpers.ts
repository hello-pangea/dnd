import type { Position, BoxModel } from 'css-box-model';
import { invariant } from '../../../../src/invariant';
import type { DropReason } from '../../../../src/types';
import * as attributes from '../../../../src/view/data-attributes';
import { defaultItemRender } from './app';
import type { RenderItem, Item } from './app';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DraggableId,
} from '../../../../src';
import { getComputedSpacing, getPreset } from '../../../util/dimension';

export function getOffset(el: HTMLElement): Position {
  const style: CSSStyleDeclaration = el.style;

  const transform: string = style.transform;
  if (!transform) {
    return { x: 0, y: 0 };
  }

  const regex: RegExp = /translate\((\d+)px, (\d+)px\)/;

  const result = transform.match(regex);
  invariant(result, `Unable to formate translate: ${transform}`);

  return {
    x: Number(result[1]),
    y: Number(result[2]),
  };
}

export function getDropReason(onDragEnd: JestMockFn<any, any>): DropReason {
  const calls = onDragEnd.mock.calls;

  invariant(calls.length, 'There has been no calls to onDragEnd');

  return calls[0][0].reason;
}
export function isDragging(el: HTMLElement): boolean {
  return el.getAttribute('data-is-dragging') === 'true';
}

export function isDropAnimating(el: HTMLElement): boolean {
  return el.getAttribute('data-is-drop-animating') === 'true';
}

export function isCombining(el: HTMLElement): boolean {
  return el.getAttribute('data-is-combining') === 'true';
}

export function isCombineTarget(el: HTMLElement): boolean {
  return el.getAttribute('data-is-combine-target') === 'true';
}

export function isClone(el: HTMLElement): boolean {
  return el.getAttribute('data-is-clone') === 'true';
}

export function isOver(el: HTMLElement): string | undefined | null {
  const value: string | undefined | null = el.getAttribute('data-is-over');
  return value || null;
}

const preset = getPreset();

export const renderItemAndSpy = (mock: JestMockFn<any, any>): RenderItem => (
  item: Item,
) => {
  const render = defaultItemRender(item);
  return (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
  ) => {
    mock(provided, snapshot, rubric);
    return render(provided, snapshot, rubric);
  };
};

export type Call = [DraggableProvided, DraggableStateSnapshot, DraggableRubric];

export const getCallsFor = (
  id: DraggableId,
  mock: JestMockFn<any, any>,
): Call[] => {
  return mock.mock.calls.filter((call) => {
    const provided: DraggableProvided = call[0];
    return provided.draggableProps['data-rfd-draggable-id'] === id;
  });
};

export const getProvidedFor = (
  id: DraggableId,
  mock: JestMockFn<any, any>,
): DraggableProvided[] => {
  return getCallsFor(id, mock).map((call) => {
    return call[0];
  });
};

export const getSnapshotsFor = (
  id: DraggableId,
  mock: JestMockFn<any, any>,
): DraggableStateSnapshot[] => {
  return getCallsFor(id, mock).map((call) => {
    return call[1];
  });
};

export const getRubricsFor = (
  id: DraggableId,
  mock: JestMockFn<any, any>,
): DraggableRubric[] => {
  return getCallsFor(id, mock).map((call) => {
    return call[2];
  });
};

export function getLast<T>(values: T[]): T | undefined | null {
  return values[values.length - 1] || null;
}

const dimensions = {
  '0': preset.inHome1,
  '1': preset.inHome2,
  '2': preset.inHome3,
  '3': preset.inHome4,
};

export const withPoorDimensionMocks = (
  fn: (a: typeof preset) => void,
): void => {
  // lists and all items will have the same dimensions
  // This is so that when we move we are combining
  const protoSpy = jest
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function fake() {
      invariant(
        this instanceof HTMLElement,
        'Expected "this" to be a HTMLElement',
      );

      const el: HTMLElement = (this as any) as HTMLElement;

      if (el.getAttribute(attributes.droppable.id)) {
        return preset.home.client.borderBox;
      }

      const id: DraggableId | undefined | null = el.getAttribute(
        attributes.draggable.id,
      );
      invariant(id, 'Expected element to be a draggable');

      return dimensions[id].client.borderBox;
    });

  // Stubbing out totally - not including margins in this
  const styleSpy = jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(function fake(el: HTMLElement) {
      function getSpacing(box: BoxModel) {
        return getComputedSpacing({
          margin: box.margin,
          padding: box.padding,
          border: box.border,
        });
      }

      if (el.getAttribute(attributes.droppable.id)) {
        return getSpacing(preset.home.client);
      }

      const id: DraggableId | undefined | null = el.getAttribute(
        attributes.draggable.id,
      );

      // this can happen when we search up the DOM for scroll containers
      if (!id) {
        return getComputedSpacing({});
      }

      return getSpacing(dimensions[id].client);
    });

  try {
    fn(preset);
  } finally {
    protoSpy.mockRestore();
    styleSpy.mockRestore();
  }
};

export const atRest: DraggableStateSnapshot = {
  isClone: false,
  isDragging: false,
  isDropAnimating: false,
  dropAnimation: null,
  draggingOver: null,
  combineWith: null,
  combineTargetFor: null,
  mode: null,
};
