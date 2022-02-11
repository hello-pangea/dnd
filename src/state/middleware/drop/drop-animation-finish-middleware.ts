import { invariant } from '../../../invariant';
import { completeDrop } from '../../action-creators';
import type { State } from '../../../types';
import type { Middleware } from '../../store-types';

const dropAnimationFinishMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (action.type !== 'DROP_ANIMATION_FINISHED') {
      next(action);
      return;
    }

    const state: State = store.getState();
    invariant(
      state.phase === 'DROP_ANIMATING',
      'Cannot finish a drop animating when no drop is occurring',
    );
    store.dispatch(completeDrop({ completed: state.completed }));
  };

export default dropAnimationFinishMiddleware;
