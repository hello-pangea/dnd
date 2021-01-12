import type { ImpactLocation, DroppableId, DragImpact } from '../../types';

export default (impact: DragImpact): DroppableId | undefined | null => {
  const at: ImpactLocation | undefined | null = impact.at;

  if (!at) {
    return null;
  }

  if (at.type === 'REORDER') {
    return at.destination.droppableId;
  }

  return at.combine.droppableId;
};
