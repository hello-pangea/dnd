import type { Position } from 'css-box-model';
import { moveByWindowScroll } from '../action-creators';
import type {
  Middleware,
  Action,
  DropAnimateAction,
  DropCompleteAction,
  FlushAction,
} from '../store-types';
import getScrollListener from '../../view/scroll-listener';

// TODO: this is taken from auto-scroll. Let's make it a util
const shouldEnd = (
  action: Action,
): action is DropAnimateAction | DropCompleteAction | FlushAction =>
  action.type === 'DROP_COMPLETE' ||
  action.type === 'DROP_ANIMATE' ||
  action.type === 'FLUSH';

const scrollListener: Middleware = (store) => {
  const listener = getScrollListener({
    onWindowScroll: (newScroll: Position) => {
      store.dispatch(moveByWindowScroll({ newScroll }));
    },
  });

  return (next) => (action) => {
    if (!listener.isActive() && action.type === 'INITIAL_PUBLISH') {
      listener.start();
    }

    if (listener.isActive() && shouldEnd(action)) {
      listener.stop();
    }

    next(action);
  };
};

export default scrollListener;
