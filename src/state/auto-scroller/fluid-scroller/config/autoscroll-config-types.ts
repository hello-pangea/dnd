// Types used to control how the fluid auto scroll feels
export interface PartialAutoScrollConfig {
  // percentage distance from edge of container at which to start auto scrolling
  startFromPercentage?: number;
  // percentage distance from edge of container at which max scroll speed is achieved
  maxScrollAtPercentage?: number;
  // pixels per frame
  maxPixelScroll?: number;

  // A function used to ease a percentage value
  // A simple linear function would be: (percentage) => percentage;
  // percentage is between 0 and 1
  // result must be between 0 and 1
  ease?: (percentage: number) => number;

  durationDampening?: {
    // ms: how long to dampen the speed of an auto scroll from the start of a drag
    stopDampeningAt?: number;
    // ms: when to start accelerating the reduction of duration dampening
    accelerateAt?: number;
  };

  // whether or not autoscroll should be turned off entirely
  disabled?: boolean;
}

// full version of the PartialAutoScrollConfig, used to establish default
// parameters for user control over autoScroll
export interface AutoScrollConfig {
  startFromPercentage: number;
  maxScrollAtPercentage: number;
  maxPixelScroll: number;
  ease: (percentage: number) => number;
  durationDampening: {
    stopDampeningAt: number;
    accelerateAt: number;
  };
  disabled: boolean;
}
