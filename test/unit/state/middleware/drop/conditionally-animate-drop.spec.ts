import type { Position } from 'css-box-model';
import { invariant } from '../../../../../src/invariant';
import {
  animateDrop,
  flush,
  completeDrop,
  drop,
  initialPublish,
  move,
  moveDown,
  updateDroppableIsCombineEnabled,
  moveUp,
} from '../../../../../src/state/action-creators';
import type {
  InitialPublishArgs,
  AnimateDropArgs,
} from '../../../../../src/state/action-creators';
import type { Store } from '../../../../../src/state/store-types';
import middleware from '../../../../../src/state/middleware/drop';
import getDropDuration from '../../../../../src/state/middleware/drop/get-drop-duration';
import { add, origin } from '../../../../../src/state/position';
import {
  preset,
  getDragStart,
  initialPublishArgs,
  homeImpact,
  afterCritical,
  critical,
  getCompletedArgs,
  getDropImpactForReason,
} from '../../../../util/preset-action-args';
import createStore from '../util/create-store';
import passThrough from '../util/pass-through-middleware';
import type {
  DropResult,
  CompletedDrag,
  DraggableLocation,
  DropReason,
  DragImpact,
  State,
  Combine,
} from '../../../../../src/types';
import getDropImpact from '../../../../../src/state/middleware/drop/get-drop-impact';
import getNewHomeClientOffset from '../../../../../src/state/middleware/drop/get-new-home-client-offset';
import { tryGetCombine } from '../../../../../src/state/get-impact-location';

['DROP', 'CANCEL'].forEach((reason: DropReason) => {
  describe(`with drop reason: ${reason}`, () => {
    it('should fire a complete drop action is no drop animation is required', () => {
      const mock = jest.fn();
      const store: Store = createStore(passThrough(mock), middleware);

      store.dispatch(flush());
      store.dispatch(initialPublish(initialPublishArgs));
      expect(store.getState().phase).toBe('DRAGGING');

      // no movement yet
      mock.mockReset();
      store.dispatch(drop({ reason }));

      expect(mock).toHaveBeenCalledWith(drop({ reason }));
      expect(mock).toHaveBeenCalledWith(completeDrop(getCompletedArgs(reason)));
      expect(mock).toHaveBeenCalledTimes(2);

      // reset to initial phase
      expect(store.getState().phase).toBe('IDLE');
    });

    it('should fire an animate drop action if a drop animation movement is required', () => {
      const mock = jest.fn();
      const store: Store = createStore(passThrough(mock), middleware);

      store.dispatch(initialPublish(initialPublishArgs));
      expect(store.getState().phase).toBe('DRAGGING');

      // moving a little bit so that a drop animation will be needed
      const shift: Position = { x: 1, y: 1 };
      store.dispatch(
        move({
          client: add(initialPublishArgs.clientSelection, shift),
        }),
      );
      const current: State = store.getState();
      invariant(current.isDragging);
      // impact is cleared when cancelling
      const destination: DraggableLocation | undefined | null =
        reason === 'DROP' ? getDragStart().source : null;

      mock.mockReset();
      store.dispatch(drop({ reason }));

      const result: DropResult = {
        ...getDragStart(),
        destination,
        reason,
        combine: null,
      };
      const completed: CompletedDrag = {
        result,
        impact: getDropImpactForReason(reason),
        critical,
        afterCritical,
      };
      const args: AnimateDropArgs = {
        completed,
        newHomeClientOffset: origin,
        dropDuration: getDropDuration({
          current: shift,
          destination: origin,
          reason,
        }),
      };
      expect(mock).toHaveBeenCalledWith(drop({ reason }));
      expect(mock).toHaveBeenCalledWith(animateDrop(args));
      expect(mock).toHaveBeenCalledTimes(2);
      expect(store.getState().phase).toBe('DROP_ANIMATING');
    });

    it('should fire an animate drop action if combining', () => {
      const mock = jest.fn();
      const store: Store = createStore(passThrough(mock), middleware);

      const inSnapMode: InitialPublishArgs = {
        ...initialPublishArgs,
        movementMode: 'SNAP',
      };
      store.dispatch(initialPublish(inSnapMode));
      store.dispatch(
        updateDroppableIsCombineEnabled({
          id: inSnapMode.critical.droppable.id,
          isCombineEnabled: true,
        }),
      );
      {
        const current: State = store.getState();
        invariant(current.phase === 'DRAGGING');
        invariant(current.movementMode === 'SNAP');
        invariant(
          current.dimensions.droppables[inSnapMode.critical.droppable.id]
            .isCombineEnabled,
        );
      }
      // combine
      store.dispatch(moveDown());
      // move past and shift item up
      store.dispatch(moveDown());
      // move backwards onto the displaced item
      store.dispatch(moveUp());
      mock.mockReset();

      const current: State = store.getState();
      invariant(current.isDragging);

      // if (reason === 'DROP') {
      const combine: Combine | undefined | null = tryGetCombine(current.impact);
      invariant(combine);
      // moved forwards past in home2, and then backwards onto it
      expect(combine).toEqual({
        draggableId: preset.inHome2.descriptor.id,
        droppableId: preset.home.descriptor.id,
      });

      store.dispatch(drop({ reason }));

      const combineDropImpact: DragImpact = getDropImpact({
        reason,
        draggables: preset.draggables,
        lastImpact: current.impact,
        home: preset.home,
        viewport: preset.viewport,
        onLiftImpact: homeImpact,
        afterCritical,
      }).impact;

      const completed: CompletedDrag = {
        critical,
        impact: combineDropImpact,
        afterCritical,
        result: {
          ...getDragStart(),
          // we are using snap movements
          mode: 'SNAP',
          destination: null,
          combine: reason === 'DROP' ? combine : null,
          reason,
        },
      };
      const args: AnimateDropArgs = {
        completed,
        newHomeClientOffset: getNewHomeClientOffset({
          impact: combineDropImpact,
          draggable: preset.inHome1,
          dimensions: preset.dimensions,
          viewport: preset.viewport,
          afterCritical,
        }),
        // $ExpectError - wrong type
        dropDuration: expect.any(Number),
      };
      expect(mock).toHaveBeenCalledWith(drop({ reason }));
      expect(mock).toHaveBeenCalledWith(animateDrop(args));
      expect(mock).toHaveBeenCalledTimes(2);
      expect(store.getState().phase).toBe('DROP_ANIMATING');
    });
  });
});
