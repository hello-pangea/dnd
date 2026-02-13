const supportedMatchesName:
  | 'matches'
  | 'msMatchesSelector'
  | 'webkitMatchesSelector' = (() => {
  const base = 'matches' as const;

  // Server side rendering
  if (typeof document === 'undefined') {
    return base;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  const candidates = [
    base,
    'msMatchesSelector' as const,
    'webkitMatchesSelector' as const,
  ];

  const value = candidates.find((name): boolean => name in Element.prototype);

  return value || base;
})();

function closestPonyfill(el: Element | null, selector: string): null | Element {
  if (el == null) {
    return null;
  }

  // Element.prototype.matches is supported in ie11 with a different name
  // https://caniuse.com/#feat=matchesselector
  if (el[supportedMatchesName as 'matches'](selector)) {
    return el;
  }

  // recursively look up the tree
  return closestPonyfill(el.parentElement, selector);
}

function closestImpl(el: Element, selector: string): Element | null {
  // Using native closest for maximum speed where we can
  if (el.closest) {
    return el.closest(selector);
  }
  // ie11: damn you!
  return closestPonyfill(el, selector);
}

export default function closest(el: Element, selector: string): Element | null {
  // TODO...
  // @ts-ignore:next-line
  if (!el || el === document || el === window) {
    return null;
  }
  const found = closestImpl(el, selector);

  if (found) {
    return found;
  }

  const root = el.getRootNode();
  return closest((root as ShadowRoot).host, selector);
}