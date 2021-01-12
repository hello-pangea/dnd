export default (el?: Element | null): typeof window =>
  el && el.ownerDocument ? el.ownerDocument.defaultView : window;
