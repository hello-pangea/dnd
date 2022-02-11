import { invariant } from '../../invariant';
import type { AutoScroller } from '../auto-scroller/auto-scroller-types';
import type {
  Action,
  Middleware,
  DropCompleteAction,
  DropAnimateAction,
  FlushAction,
} from '../store-types';
import type { State } from '../../types';

const shouldStop = (
  action: Action,
): action is DropCompleteAction | DropAnimateAction | FlushAction =>
  action.type === 'DROP_COMPLETE' ||
  action.type === 'DROP_ANIMATE' ||
  action.type === 'FLUSH';

export default (autoScroller: AutoScroller): Middleware =>
  (store) =>
  (next) =>
  (action: Action) => {
    if (shouldStop(action)) {
      autoScroller.stop();
      next(action);
      return;
    }

    if (action.type === 'INITIAL_PUBLISH') {
      // letting the action go first to hydrate the state
      next(action);
      const state: State = store.getState();
      invariant(
        state.phase === 'DRAGGING',
        'Expected phase to be DRAGGING after INITIAL_PUBLISH',
      );
      autoScroller.start(state);
      return;
    }

    // auto scroll happens in response to state changes
    // releasing all actions to the reducer first
    next(action);

    autoScroller.scroll(store.getState());
  };
