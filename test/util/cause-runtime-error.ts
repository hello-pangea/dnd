export function getRuntimeError(): Event {
  return new window.ErrorEvent('error', {
    error: new Error('non-rfd'),
    cancelable: true,
  });
}

export default function causeRuntimeError() {
  window.dispatchEvent(getRuntimeError());
}
