const supportedEventName: string = ((): string => {
  const base = 'visibilitychange';

  // Server side rendering
  if (typeof document === 'undefined') {
    return base;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  const candidates: string[] = [
    base,
    `ms${base}`,
    `webkit${base}`,
    `moz${base}`,
    `o${base}`,
  ];

  const supported = candidates.find(
    (eventName: string): boolean => `on${eventName}` in document,
  );

  return supported || base;
})();

export default supportedEventName;
