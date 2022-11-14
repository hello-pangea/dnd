import type { Rect, Spacing } from 'css-box-model';
import getDistanceThresholds from './get-distance-thresholds';
import { AutoScrollConfig } from '../../config/autoscroll-config-types';
import type { DistanceThresholds } from './get-distance-thresholds';
import type { Axis } from '../../../../../types';
import getValue from './get-value';


interface GetOnAxisArgs {
  container: Rect;
  distanceToEdges: Spacing;
  dragStartTime: number;
  axis: Axis;
  shouldUseTimeDampening: boolean;
  autoScrollOptions: AutoScrollConfig;
}

export default ({
  container,
  distanceToEdges,
  dragStartTime,
  axis,
  shouldUseTimeDampening,
  autoScrollOptions
}: GetOnAxisArgs): number => {
  const thresholds: DistanceThresholds = getDistanceThresholds(container, axis, autoScrollOptions);
  const isCloserToEnd: boolean =
    distanceToEdges[axis.end] < distanceToEdges[axis.start];

  if (isCloserToEnd) {
    return getValue({
      distanceToEdge: distanceToEdges[axis.end],
      thresholds,
      dragStartTime,
      shouldUseTimeDampening,
      autoScrollOptions
    });
  }

  return (
    -1 *
    getValue({
      distanceToEdge: distanceToEdges[axis.start],
      thresholds,
      dragStartTime,
      shouldUseTimeDampening,
      autoScrollOptions
    })
  );
};
