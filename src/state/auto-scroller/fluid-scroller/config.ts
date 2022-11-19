import { AutoScrollOptions } from './autoscroll-config-types';

// default autoScroll configuration options
export const defaultAutoScrollOptions: AutoScrollOptions = {
  startFromPercentage: 0.25,
  maxScrollAtPercentage: 0.05,
  maxPixelScroll: 28,
  ease: (percentage: number): number => percentage ** 2,
  durationDampening: {
    stopDampeningAt: 1200,
    accelerateAt: 360,
  },
  disabled: false,
};
