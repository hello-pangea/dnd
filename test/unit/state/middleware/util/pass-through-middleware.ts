import type {
  Action,
  Dispatch,
  Middleware,
} from '../../../../../src/state/store-types';

const passThroughMiddleware = (
  mock: jest.Mock<unknown, [Action]>,
): Middleware => {
  const result: Middleware = () => (next: Dispatch) => (action: Action) => {
    mock(action);
    next(action);
  };

  return result;
};

export default passThroughMiddleware;
