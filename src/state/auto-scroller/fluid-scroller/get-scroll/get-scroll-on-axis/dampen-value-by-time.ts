import getPercentage from '../../get-percentage';
import { AutoScrollConfig } from '../../config/autoscroll-config-types';
import minScroll from './min-scroll';

export default (proposedScroll: number, dragStartTime: number, autoScrollOptions: AutoScrollConfig): number => {
  const accelerateAt: number = autoScrollOptions.durationDampening.accelerateAt;
  const stopAt: number = autoScrollOptions.durationDampening.stopDampeningAt;

  const startOfRange: number = dragStartTime;
  const endOfRange: number = stopAt;
  const now: number = Date.now();
  const runTime: number = now - startOfRange;

  // we have finished the time dampening period
  if (runTime >= stopAt) {
    return proposedScroll;
  }

  // Up to this point we know there is a proposed scroll
  // but we have not reached our accelerate point
  // Return the minimum amount of scroll
  if (runTime < accelerateAt) {
    return minScroll;
  }

  const betweenAccelerateAtAndStopAtPercentage: number = getPercentage({
    startOfRange: accelerateAt,
    endOfRange,
    current: runTime,
  });

  const scroll: number =
    proposedScroll * autoScrollOptions.ease(betweenAccelerateAtAndStopAtPercentage);

  return Math.ceil(scroll);
};
