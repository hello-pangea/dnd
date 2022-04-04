import type { Position } from 'css-box-model';
import * as timings from '../../debug/timings';
import type { PublishingResult } from './dimension-marshal-types';
import type {
  Registry,
  DraggableEntry,
  DroppableEntry,
} from '../registry/registry-types';
import { toDraggableMap, toDroppableMap } from '../dimension-structures';
import type {
  DroppableDescriptor,
  DroppableDimension,
  DraggableDimension,
  DimensionMap,
  Critical,
  Viewport,
} from '../../types';
import getViewport from '../../view/window/get-viewport';

interface Args {
  critical: Critical;
  registry: Registry;
}

window.addEventListener('resize', console.log);

export default ({ critical, registry }: Args): PublishingResult => {
  const timingKey = 'Update collection from DOM';
  timings.start(timingKey);
  const viewport: Viewport = getViewport();
  const windowScroll: Position = viewport.scroll.current;

  const home: DroppableDescriptor = critical.droppable;

  const droppables: DroppableDimension[] = registry.droppable
    .getAllByType(home.type)
    .map(
      (entry: DroppableEntry): DroppableDimension =>
        entry.callbacks.getDimension(windowScroll),
    );

  const draggables: DraggableDimension[] = registry.draggable
    .getAllByType(critical.draggable.type)
    .map(
      (entry: DraggableEntry): DraggableDimension =>
        entry.getDimension(windowScroll),
    );

  console.log({ droppables, draggables, viewport });

  const dimensions: DimensionMap = {
    draggables: toDraggableMap(draggables),
    droppables: toDroppableMap(droppables),
  };

  timings.finish(timingKey);

  const result: PublishingResult = {
    dimensions,
    critical,
    viewport,
  };

  return result;
};
