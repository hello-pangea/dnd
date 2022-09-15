import type JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * @testing-library/dom and jsdom do not properly implement
 * the TransitionEvent. So we are implementing our own polyfill.
 *
 * See:
 *  - https://github.com/testing-library/dom-testing-library/pull/865
 *  - https://github.com/jsdom/jsdom/issues/1781
 *  - https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/TransitionEvent
 *
 * Inspirated by: https://codesandbox.io/s/bgfz1?file=%2Fsrc%2Findex.test.js%3A70-363
 */
export default function transitionEventPolyfill(this: JSDOMEnvironment) {
  class TransitionEvent extends this.global.Event {
    readonly elapsedTime: number;
    readonly propertyName: string;
    readonly pseudoElement: string;

    constructor(
      type: string,
      transitionEventInitDict: TransitionEventInit = {},
    ) {
      super(type, transitionEventInitDict);

      this.elapsedTime = transitionEventInitDict.elapsedTime || 0.0;
      this.propertyName = transitionEventInitDict.propertyName || '';
      this.pseudoElement = transitionEventInitDict.pseudoElement || '';
    }
  }

  this.global.TransitionEvent = TransitionEvent;
}
