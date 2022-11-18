import type { Rect } from 'css-box-model';
import { AutoScrollConfig } from '../../config/autoscroll-config-types';
import type { Axis } from '../../../../../types';
import { defaultAutoScrollConfig } from '../../config/use-autoscroll-config';

// all in pixels
export interface DistanceThresholds {
  startScrollingFrom: number;
  maxScrollValueAt: number;
}

// converts the percentages in the config into actual pixel values
export default (
  container: Rect,
  axis: Axis,
  autoScrollOptions: AutoScrollConfig = defaultAutoScrollConfig,
): DistanceThresholds => {
  const startScrollingFrom: number =
    container[axis.size] * autoScrollOptions.startFromPercentage;
  const maxScrollValueAt: number =
    container[axis.size] * autoScrollOptions.maxScrollAtPercentage;

  const thresholds: DistanceThresholds = {
    startScrollingFrom,
    maxScrollValueAt,
  };

  return thresholds;
};
