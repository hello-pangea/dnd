import type { Middleware } from '../../../../../src/state/store-types';

const passThroughMiddleware = (
  mock: jest.Mock<unknown, [unknown]>,
): Middleware => {
  const result: Middleware = () => (next) => (action) => {
    mock(action);
    next(action);
  };

  return result;
};

export default passThroughMiddleware;
