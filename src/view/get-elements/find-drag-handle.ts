import type { DraggableId, ContextId } from '../../types';
import { dragHandle as dragHandleAttr } from '../data-attributes';
import { warning } from '../../dev-warning';
import { queryElements } from '../../query-selector-all';
import isHtmlElement from '../is-type-of-element/is-html-element';

export default function findDragHandle(
  contextId: ContextId,
  draggableId: DraggableId,
  ref: HTMLElement | null,
): HTMLElement | null {
  // cannot create a selector with the draggable id as it might not be a valid attribute selector
  const selector = `[${dragHandleAttr.contextId}="${contextId}"]`;
  const handle = queryElements(
    ref,
    selector,
    (el: Element): boolean => {
      return el.getAttribute(dragHandleAttr.draggableId) === draggableId;
    },
  );

  if (!handle) {
    warning(
      `Unable to find drag handle with id "${draggableId}" as no handle with a matching id was found`,
    );
    return null;
  }

  if (!isHtmlElement(handle)) {
    warning('drag handle needs to be a HTMLElement');
    return null;
  }

  return handle;
}
