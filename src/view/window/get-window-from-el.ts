export default (el?: Element | null): typeof window =>
  el?.ownerDocument?.defaultView || window;
