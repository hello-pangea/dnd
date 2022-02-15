declare module 'raf-stub' {
  interface Stub {
    add: (cb: () => void) => number;
    remove: (id: number) => void;
    flush: (duration?: number) => void;
    reset: () => void;
    step: (steps?: number, duration?: number) => void;
  }

  export default (a: number, b: number) => Stub;
}
