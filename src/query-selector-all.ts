export function getEventTarget(event: Event): EventTarget {
  const target = event.composedPath && event.composedPath()[0];
  return target || event.target;
}

export function getEventTargetRoot(event: Event | null): Node {
  const source = event && event.composedPath && event.composedPath()[0];
  const root = source && (source as Element).getRootNode();
  return root || document;
}

export function queryElements(
  ref: Node | null,
  selector: string,
  filterFn: (el:Element) => boolean,
): Element | undefined {
  const rootNode: any = ref && ref.getRootNode();
  const documentOrShadowRoot: ShadowRoot | Document = rootNode && rootNode.querySelectorAll ? rootNode : document;
  const possible = Array.from(documentOrShadowRoot.querySelectorAll(selector));
  const filtered = possible.find(filterFn);

  // in case nothing was found in this document/shadowRoot we recursievly try the parent document(Fragment) given
  // by the host property. This is needed in case the the draggable/droppable itself contains a shadow root
  if (!filtered && (documentOrShadowRoot as ShadowRoot).host) {
    return queryElements(
      (documentOrShadowRoot as ShadowRoot).host,
      selector,
      filterFn,
    );
  }
  return filtered;
}
