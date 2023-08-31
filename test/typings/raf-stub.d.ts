declare module 'raf-stub' {
  interface Stub {
    add: (cb: () => void) => number;
    remove: (id: number) => void;
    flush: (duration?: number) => void;
    reset: () => void;
    step: (steps?: number, duration?: number) => void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export default (a: number, b: number) => Stub;
}
