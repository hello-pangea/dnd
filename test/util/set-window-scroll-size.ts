import { invariant } from '../../src/invariant';
import writable from './writable';

type Args = {
  scrollHeight: number;
  scrollWidth: number;
};

const setWindowScrollSize = ({ scrollHeight, scrollWidth }: Args): void => {
  const el = document.documentElement;

  invariant(el, 'Unable to find document element');

  writable(el).scrollHeight = scrollHeight;
  writable(el).scrollWidth = scrollWidth;
};

const original: Args = (() => {
  const el = document.documentElement;

  invariant(el, 'Unable to find document element');

  return {
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
  };
})();

export const resetWindowScrollSize = () => setWindowScrollSize(original);

export default setWindowScrollSize;
