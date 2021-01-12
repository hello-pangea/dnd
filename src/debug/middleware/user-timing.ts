import type { Action } from '../../state/store-types';

export default () => (next: (a: Action) => unknown) => (
  action: Action,
): any => {
  const title: string = `👾 redux (action): ${action.type}`;
  const startMark: string = `${action.type}:start`;
  const endMark: string = `${action.type}:end`;

  performance.mark(startMark);
  const result: unknown = next(action);
  performance.mark(endMark);

  performance.measure(title, startMark, endMark);

  return result;
};
