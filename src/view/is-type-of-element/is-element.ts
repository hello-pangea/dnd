import getWindowFromEl from '../window/get-window-from-el';

export default function isElement(el: any): boolean {
  return el instanceof getWindowFromEl(el).Element;
}
