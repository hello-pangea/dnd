import React from 'react';
import type { DraggableId, DroppableId, TypeId } from '../../types';

export type DroppableContextValue = {
  isUsingCloneFor: DraggableId | null;
  droppableId: DroppableId;
  type: TypeId;
};

export default React.createContext<DroppableContextValue | null>(null);
