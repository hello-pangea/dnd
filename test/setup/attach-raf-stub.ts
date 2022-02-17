// Stub requestAnimationFrame
import type JSDOMEnvironment from 'jest-environment-jsdom';
import createStub from 'raf-stub';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace requestAnimationFrame {
    function add(cb: () => void): number;
    function remove(id: number): void;
    function flush(duration?: number): void;
    function reset(): void;
    function step(steps?: number, duration?: number): void;
  }
}

// We need to do this, because it is difficult to override the
// requestAnimationFrame globally, because when using the
// `jest.useFakeTimers` it change the requestAnimationFrame global
// method withan other so some of our test do not work. Here we
// are making sure we have the requestAnimationFrame and
// cancelAnimationFrame even when using `jest.useFakeTimers`.
export default function attachRafStub(this: JSDOMEnvironment) {
  const startTime = this.global.performance.now();

  const rafStub = createStub(1000 / 60, startTime);

  Object.assign(rafStub.add, {
    step: rafStub.step,
    flush: rafStub.flush,
    reset: rafStub.reset,
  });

  this.global.requestAnimationFrame = rafStub.add;
  this.global.cancelAnimationFrame = rafStub.remove;

  if (this.fakeTimers) {
    const originalUseFakeTimers = this.fakeTimers.useFakeTimers.bind(
      this.fakeTimers,
    );

    this.fakeTimers.useFakeTimers = () => {
      originalUseFakeTimers();

      this.global.requestAnimationFrame = rafStub.add;
      this.global.cancelAnimationFrame = rafStub.remove;
    };

    const originalUseRealTimers = this.fakeTimers.useRealTimers.bind(
      this.fakeTimers,
    );
    this.fakeTimers.useRealTimers = () => {
      originalUseRealTimers();

      this.global.requestAnimationFrame = rafStub.add;
      this.global.cancelAnimationFrame = rafStub.remove;
    };
  }

  if (this.fakeTimersModern) {
    const originalModernUseFakeTimers =
      this.fakeTimersModern.useFakeTimers.bind(this.fakeTimersModern);

    this.fakeTimersModern.useFakeTimers = () => {
      originalModernUseFakeTimers();

      this.global.requestAnimationFrame = rafStub.add;
      this.global.cancelAnimationFrame = rafStub.remove;
    };

    const originalModernUseRealTimers =
      this.fakeTimersModern.useRealTimers.bind(this.fakeTimersModern);
    this.fakeTimersModern.useRealTimers = () => {
      originalModernUseRealTimers();

      this.global.requestAnimationFrame = rafStub.add;
      this.global.cancelAnimationFrame = rafStub.remove;
    };
  }
}
