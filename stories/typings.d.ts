declare module '*.png' {
  const src: string;
  export default src;
}

// This is a temporary fix.
// The declar of use-memo-one is up to date on GitHub,
// but the maintainer has not published a new version to NPM.
// We should consider incorporating the library and remove
// it from our dependencies.
declare module 'use-memo-one' {
  type DependencyList = ReadonlyArray<unknown>;

  declare function useMemoOne<T>(
    // getResult changes on every call,
    getResult: () => T,
    // the inputs array changes on every call
    inputs: DependencyList | undefined,
  ): T;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare function useCallbackOne<T extends (...args: any[]) => any>(
    // getResult changes on every call,
    callback: T,
    // the inputs array changes on every call
    inputs: DependencyList | undefined,
  ): T;

  export {
    useMemoOne,
    useCallbackOne,
    useMemoOne as useMemo,
    useCallbackOne as useCallback,
  };
}
