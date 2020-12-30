type EventOptions = {
  passive?: boolean;
  capture?: boolean;
  once?: boolean;
};

type EventBinding = {
  eventName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => any;
  options?: EventOptions;
};

function bindEvents(
  el: HTMLElement | Window,
  bindings: EventBinding[],
  sharedOptions?: EventOptions,
): () => void;

export default bindEvents;
