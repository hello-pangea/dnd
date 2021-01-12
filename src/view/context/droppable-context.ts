import React from 'react';
import type { DraggableId, DroppableId, TypeId } from '../../types';

export type DroppableContextValue = {
  isUsingCloneFor: DraggableId | undefined | null;
  droppableId: DroppableId;
  type: TypeId;
};

export default React.createContext<DroppableContextValue | undefined | null>(
  null,
);
