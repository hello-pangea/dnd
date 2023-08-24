import type { DroppableDimension } from '../../../../../src/types';
import type { InternalOwnProps } from '../../../../../src/view/droppable/droppable-types';
import getBodyElement from '../../../../../src/view/get-body-element';

export default (dimension: DroppableDimension): InternalOwnProps => ({
  droppableId: dimension.descriptor.id,
  type: dimension.descriptor.type,
  isDropDisabled: false,
  isCombineEnabled: true,
  isCombineAllowedForItem: undefined,
  direction: dimension.axis.direction,
  ignoreContainerClipping: false,
  children: () => null,
  getContainerForClone: getBodyElement,
  mode: 'standard',
  renderClone: null,
});
