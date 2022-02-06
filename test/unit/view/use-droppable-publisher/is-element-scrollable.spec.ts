import { invariant } from '../../../../src/invariant';
import getClosestScrollable from '../../../../src/view/use-droppable-publisher/get-closest-scrollable';
import { disableWarn } from '../../../util/console';

it('should return true if an element has overflow:auto or overflow:scroll', () => {
  (['overflowY', 'overflowX'] as const).forEach((overflow) => {
    ['auto', 'scroll'].forEach((value: string) => {
      const el: HTMLElement = document.createElement('div');
      el.style[overflow] = value;
      expect(getClosestScrollable(el)).toBe(el);
    });
  });
});

it('should return false if an element has overflow:visible', () => {
  (['overflowY', 'overflowX'] as const).forEach((overflow) => {
    const el: HTMLElement = document.createElement('div');
    el.style[overflow] = 'visible';
    expect(getClosestScrollable(el)).toBe(null);
  });
});

describe('body detection', () => {
  // The `body` is considered a scroll container when:
  // 1. The `body` has `overflow-[x|y]: auto | scroll` AND
  // 2. The parent of `body` (`html`) has an `overflow-[x|y]` set to anything except `visible` AND
  // 3. There is a current overflow in the `body`
  const body: Element | null = document.body;
  invariant(body);
  invariant(body instanceof HTMLBodyElement);
  const html: Element | null = body.parentElement;
  invariant(html);
  invariant(html === document.documentElement);
  invariant(html instanceof HTMLElement);

  const reset = (el: Element) => {
    invariant(el instanceof HTMLElement);
    el.style.overflowX = 'visible';
    el.style.overflowY = 'visible';
  };

  disableWarn();

  beforeEach(() => {
    reset(body);
    reset(html);
  });

  afterAll(() => {
    reset(body);
    reset(html);
  });

  it('should warn if the body might be a scroll container', () => {
    body.style.overflowX = 'auto';
    html.style.overflowY = 'auto';

    expect(getClosestScrollable(body)).toBe(null);
    expect(console.warn).toHaveBeenCalled();
  });

  it('should not mark the body as a scroll container if it does not have any overflow set', () => {
    body.style.overflowX = 'visible';
    expect(getClosestScrollable(body)).toBe(null);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should not mark the body as a scroll container if the html element has visible overflow', () => {
    body.style.overflowX = 'auto';
    html.style.overflowY = 'visible';
    expect(getClosestScrollable(body)).toBe(null);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
