import { getRect } from 'css-box-model';
import type { Position, Rect } from 'css-box-model';
import { invariant } from '../../../../src/invariant';
import type {
  Axis,
  DraggableDimension,
  DroppableDimension,
  DraggableDimensionMap,
  DroppableSubject,
  DroppableDescriptor,
  Scrollable,
  DisplacedBy,
} from '../../../../src/types';
import {
  getDroppableDimension,
  getDraggableDimension,
} from '../../../util/dimension';
import {
  addPlaceholder,
  removePlaceholder,
} from '../../../../src/state/droppable/with-placeholder';
import { toDraggableMap } from '../../../../src/state/dimension-structures';
import { vertical, horizontal } from '../../../../src/state/axis';
import { add, patch, origin, isEqual } from '../../../../src/state/position';
import getDisplacedBy from '../../../../src/state/get-displaced-by';

const crossAxisStart: number = 0;
const crossAxisEnd: number = 100;
const crossAxisSize: number = crossAxisEnd - crossAxisStart;
const droppableSize: number = 200;
const gap: number = 10;

[vertical, horizontal].forEach((axis: Axis) => {
  describe(`on ${axis.direction} axis`, () => {
    const descriptor: DroppableDescriptor = {
      id: 'foo',
      type: 'TYPE',
      mode: 'standard',
    };
    const withoutFrame: DroppableDimension = getDroppableDimension({
      descriptor,
      direction: axis.direction,
      borderBox: {
        [axis.crossAxisStart]: crossAxisStart,
        [axis.crossAxisEnd]: crossAxisEnd,
        [axis.start]: 0,
        [axis.end]: droppableSize,
      },
    });
    const inForeign1: DraggableDimension = getDraggableDimension({
      descriptor: {
        id: 'in-foreign-1',
        index: 0,
        droppableId: descriptor.id,
        type: descriptor.type,
      },
      borderBox: {
        [axis.crossAxisStart]: crossAxisStart,
        [axis.crossAxisEnd]: crossAxisEnd,
        [axis.start]: 0,
        [axis.end]: droppableSize / 2,
      },
    });

    const inForeign2: DraggableDimension = getDraggableDimension({
      descriptor: {
        id: 'in-foreign-2',
        index: 1,
        droppableId: descriptor.id,
        type: descriptor.type,
      },
      borderBox: {
        [axis.crossAxisStart]: crossAxisStart,
        [axis.crossAxisEnd]: crossAxisEnd,
        [axis.start]: droppableSize / 2,
        // leave a little gap before the end
        [axis.end]: droppableSize - gap,
      },
    });

    const getHomeDraggable = (borderBoxSize: number): DraggableDimension =>
      getDraggableDimension({
        descriptor: {
          id: 'in-foreign-3',
          index: 2,
          droppableId: 'home',
          type: descriptor.type,
        },
        borderBox: {
          [axis.crossAxisStart]: crossAxisStart,
          [axis.crossAxisEnd]: crossAxisEnd,
          [axis.start]: inForeign2.client.borderBox[axis.end],
          [axis.end]: inForeign2.client.borderBox[axis.end] + borderBoxSize,
        },
      });

    const withHomeDraggable = (
      inHome1: DraggableDimension,
    ): DraggableDimensionMap =>
      toDraggableMap([inHome1, inForeign1, inForeign2]);

    const getPlaceholderSize = (draggable: DraggableDimension): Position =>
      patch(axis.line, draggable.displaceBy[axis.line]);

    it('should throw an error if trying to add a placeholder to a home list', () => {
      expect(() =>
        addPlaceholder(
          withoutFrame,
          inForeign1,
          toDraggableMap([inForeign1, inForeign2]),
        ),
      ).toThrow();
    });

    describe('without frame', () => {
      describe('adding placeholder', () => {
        it('should not grow the subject if not required', () => {
          const inHome: DraggableDimension = getHomeDraggable(gap - 5);

          const result: DroppableDimension = addPlaceholder(
            withoutFrame,
            inHome,
            withHomeDraggable(inHome),
          );

          const expected: DroppableSubject = {
            // unchanged
            page: withoutFrame.subject.page,
            active: withoutFrame.subject.active,
            // added
            withPlaceholder: {
              increasedBy: null,
              oldFrameMaxScroll: null,
              placeholderSize: getPlaceholderSize(inHome),
            },
          };
          expect(result.subject).toEqual(expected);
        });

        it('should grow the subject if required', () => {
          const excess: number = 20;
          const inHome: DraggableDimension = getHomeDraggable(gap + excess);

          const result: DroppableDimension = addPlaceholder(
            withoutFrame,
            inHome,
            withHomeDraggable(inHome),
          );

          const active: Rect | undefined | null = withoutFrame.subject.active;
          invariant(active);
          const expected: DroppableSubject = {
            // unchanged
            page: withoutFrame.subject.page,
            // increased
            active: getRect({
              ...active,
              [axis.end]: active[axis.end] + excess,
            }),
            // added
            withPlaceholder: {
              increasedBy: patch(axis.line, excess),
              oldFrameMaxScroll: null,
              placeholderSize: getPlaceholderSize(inHome),
            },
          };
          expect(result.subject).toEqual(expected);
        });
      });

      it('should restore the subject to its original size when placeholder is no longer needed', () => {
        const excess: number = 20;
        const inHome: DraggableDimension = getHomeDraggable(gap + excess);

        const added: DroppableDimension = addPlaceholder(
          withoutFrame,
          inHome,
          withHomeDraggable(inHome),
        );
        const removed: DroppableDimension = removePlaceholder(added);

        expect(removed).toEqual(withoutFrame);
      });
    });

    describe('with frame', () => {
      const withFrame: DroppableDimension = getDroppableDimension({
        descriptor,
        direction: axis.direction,
        borderBox: withoutFrame.client.borderBox,
        closest: {
          borderBox: withoutFrame.client.borderBox,
          scrollSize: {
            scrollWidth: axis === vertical ? crossAxisSize : droppableSize,
            scrollHeight: axis === vertical ? droppableSize : crossAxisSize,
          },
          scroll: origin,
          shouldClipSubject: false,
        },
      });
      const originalFrame: Scrollable | undefined | null = withFrame.frame;
      invariant(
        originalFrame && isEqual(originalFrame.scroll.max, origin),
        'expecting no max scroll',
      );

      it('should not grow the subject if not required', () => {
        const inHome: DraggableDimension = getHomeDraggable(gap - 5);

        const result: DroppableDimension = addPlaceholder(
          withFrame,
          inHome,
          withHomeDraggable(inHome),
        );

        const expected: DroppableSubject = {
          // unchanged
          page: withFrame.subject.page,
          active: withFrame.subject.active,
          // added
          withPlaceholder: {
            increasedBy: null,
            // holding onto old max regardless
            oldFrameMaxScroll: originalFrame.scroll.max,
            placeholderSize: getPlaceholderSize(inHome),
          },
        };
        expect(result.subject).toEqual(expected);
        // no change in frame or scroll
        const newFrame: Scrollable | undefined | null = result.frame;
        invariant(newFrame);
        expect(originalFrame.scroll.max).toEqual(newFrame.scroll.max);
        expect(originalFrame).toEqual(newFrame);
      });

      it('should grow the subject if required', () => {
        const excess: number = 20;
        const inHome: DraggableDimension = getHomeDraggable(gap + excess);

        const result: DroppableDimension = addPlaceholder(
          withFrame,
          inHome,
          withHomeDraggable(inHome),
        );

        const increasedBy: Position = patch(axis.line, excess);
        const active: Rect | undefined | null = withFrame.subject.active;
        invariant(active);
        const expected: DroppableSubject = {
          // unchanged
          page: withFrame.subject.page,
          // increased
          active: getRect({
            ...active,
            [axis.end]: active[axis.end] + excess,
          }),
          // added
          withPlaceholder: {
            increasedBy,
            oldFrameMaxScroll: originalFrame.scroll.max,
            placeholderSize: getPlaceholderSize(inHome),
          },
        };
        expect(result.subject).toEqual(expected);
        // max scroll change
        const newFrame: Scrollable | undefined | null = result.frame;
        invariant(newFrame);
        expect(originalFrame.scroll.max).not.toEqual(newFrame.scroll.max);
        expect(newFrame.scroll.max).toEqual(
          add(originalFrame.scroll.max, increasedBy),
        );
        // no client change
        expect(newFrame.frameClient).toEqual(newFrame.frameClient);
      });

      it('should restore the original frame when placeholder is no longer needed', () => {
        const excess: number = 20;
        const inHome: DraggableDimension = getHomeDraggable(gap + excess);

        const added: DroppableDimension = addPlaceholder(
          withFrame,
          inHome,
          withHomeDraggable(inHome),
        );
        const removed: DroppableDimension = removePlaceholder(added);

        expect(removed).toEqual(withFrame);
      });
    });

    describe('virtual list', () => {
      const virtual: DroppableDimension = getDroppableDimension({
        descriptor: {
          ...descriptor,
          mode: 'virtual',
        },
        direction: axis.direction,
        borderBox: withoutFrame.client.borderBox,
        closest: {
          borderBox: withoutFrame.client.borderBox,
          scrollSize: {
            scrollWidth: axis === vertical ? crossAxisSize : droppableSize,
            scrollHeight: axis === vertical ? droppableSize : crossAxisSize,
          },
          scroll: origin,
          shouldClipSubject: false,
        },
      });
      const originalFrame: Scrollable | undefined | null = virtual.frame;
      invariant(
        originalFrame && isEqual(originalFrame.scroll.max, origin),
        'expecting no max scroll',
      );

      it('should always grow the subject required', () => {
        const inHome: DraggableDimension = getHomeDraggable(gap - 5);
        const displacedBy: DisplacedBy = getDisplacedBy(
          axis,
          inHome.displaceBy,
        );
        // increasing by the whole amount, not just the gap
        // for virtual lists we cannot count the size of existing items
        // as they all might not be there
        const increasedBy: Position = patch(axis.line, displacedBy.value);

        const result: DroppableDimension = addPlaceholder(
          virtual,
          inHome,
          withHomeDraggable(inHome),
        );

        const active: Rect | undefined | null = virtual.subject.active;
        invariant(active);
        const expected: DroppableSubject = {
          // unchanged
          page: virtual.subject.page,
          // increased
          active: getRect({
            ...active,
            [axis.end]: active[axis.end] + displacedBy.value,
          }),
          // added
          withPlaceholder: {
            increasedBy,
            oldFrameMaxScroll: originalFrame.scroll.max,
            placeholderSize: getPlaceholderSize(inHome),
          },
        };
        expect(result.subject).toEqual(expected);
        // max scroll change
        const newFrame: Scrollable | undefined | null = result.frame;
        invariant(newFrame);
        expect(originalFrame.scroll.max).not.toEqual(newFrame.scroll.max);
        expect(newFrame.scroll.max).toEqual(
          add(originalFrame.scroll.max, increasedBy),
        );
        // no client change
        expect(newFrame.frameClient).toEqual(newFrame.frameClient);
      });

      it('should restore the original frame when placeholder is no longer needed', () => {
        const excess: number = 20;
        const inHome: DraggableDimension = getHomeDraggable(gap + excess);

        const added: DroppableDimension = addPlaceholder(
          virtual,
          inHome,
          withHomeDraggable(inHome),
        );
        const removed: DroppableDimension = removePlaceholder(added);

        expect(removed).toEqual(virtual);
      });
    });
  });
});
