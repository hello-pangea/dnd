// We have window and document check because some
// tests do not run with browser globals enabled

if (typeof window !== 'undefined') {
  // overriding these properties in jsdom to allow them to be controlled
  Object.defineProperties(document.documentElement, {
    clientWidth: {
      writable: true,
      value: document.documentElement.clientWidth,
    },
    clientHeight: {
      writable: true,
      value: document.documentElement.clientHeight,
    },
    scrollWidth: {
      writable: true,
      value: document.documentElement.scrollWidth,
    },
    scrollHeight: {
      writable: true,
      value: document.documentElement.scrollHeight,
    },
  });

  // Setting initial viewport
  // Need to set clientWidth and clientHeight as jsdom does not set these properties
  if (typeof document !== 'undefined') {
    (document.documentElement as any).clientWidth = window.innerWidth;
    (document.documentElement as any).clientHeight = window.innerHeight;
  }
}

export {};
