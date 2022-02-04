// Replacing requestAnimationFrame
// Adding window check because some tests do not
// run with browser globals enabled
// setting up global enzyme
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { replaceRaf } from 'raf-stub';

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  replaceRaf([global, window]);

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
}

// Setting initial viewport
// Need to set clientWidth and clientHeight as jsdom does not set these properties
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  document.documentElement.clientWidth = window.innerWidth;
  document.documentElement.clientHeight = window.innerHeight;
}

Enzyme.configure({ adapter: new Adapter() });
