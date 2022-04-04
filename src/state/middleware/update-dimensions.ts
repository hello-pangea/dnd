import { invariant } from '../../invariant';
import type { DimensionMarshal } from '../dimension-marshal/dimension-marshal-types';
import type { State, ScrollOptions, LiftRequest } from '../../types';
import type { Middleware } from '../store-types';
import {
  completeDrop,
  initialPublish,
  flush,
  beforeInitialCapture,
  updateDimensions,
} from '../action-creators';
import validateDimensions from './util/validate-dimensions';

export default (marshal: DimensionMarshal): Middleware =>
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    if (action.type !== 'DIMENSIONS_CHANGED') {
      next(action);
      return;
    }
    console.log("JEJEJEJEEJ");
    // const { id, clientSelection, movementMode } = action.payload;
    // const initial: State = getState();

    // flush dropping animation if needed
    // this can change the descriptor of the dragging item
    // Will call the onDragEnd responders

    // if (initial.phase === 'DROP_ANIMATING') {
    //   dispatch(completeDrop({ completed: initial.completed }));
    // }

    // invariant(getState().phase === 'IDLE', 'Unexpected phase to start a drag');

    // Let's get the marshal started!
    const { critical, dimensions, viewport } = marshal.updatePublishing();

    validateDimensions(critical, dimensions);

    // Okay, we are good to start dragging now
    dispatch(
      updateDimensions({
        critical,
        dimensions,
        viewport,
      }),
    );
  };
