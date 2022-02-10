// Stub requestAnimationFrame
import { replaceRaf } from 'raf-stub';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace requestAnimationFrame {
    function add(cb: () => void): number;
    function remove(id: number): void;
    function flush(duration?: number): void;
    function reset(): void;
    function step(steps?: number, duration?: number): void;
  }
}

if (typeof window !== 'undefined') {
  replaceRaf([global, window]);
}
