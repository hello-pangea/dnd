import getWindowFromEl from '../window/get-window-from-el';

export default function isHtmlElement(el: any): boolean {
  return el instanceof getWindowFromEl(el).HTMLElement;
}
