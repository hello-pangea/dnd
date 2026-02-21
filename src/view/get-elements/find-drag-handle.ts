import type { DraggableId, ContextId } from '../../types';
import { dragHandle as dragHandleAttr } from '../data-attributes';
import { warning } from '../../dev-warning';
import { querySelectorAll } from '../../query-selector-all';
import isHtmlElement from '../is-type-of-element/is-html-element';

export default function findDragHandle(
  contextId: ContextId,
  draggableId: DraggableId,
  doc?: Document,
): HTMLElement | null {
  if (!doc) {
    return null;
  }
  const selector = `[${dragHandleAttr.contextId}="${contextId}"]`;
  const possible = querySelectorAll(doc, selector);

  if (!possible.length) {
    warning(`Unable to find any drag handles with contextId "${contextId}" in the provided document`);
    return null;
  }

  const handle = possible.find((el): boolean => {
    return el.getAttribute(dragHandleAttr.draggableId) === draggableId;
  });

  if (!handle) {
    warning(
      `Unable to find drag handle with draggableId "${draggableId}" (contextId "${contextId}") in the provided document`,
    );
    return null;
  }

  if (!isHtmlElement(handle)) {
    warning('drag handle needs to be a HTMLElement');
    return null;
  }

  return handle;
}
