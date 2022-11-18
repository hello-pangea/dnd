import { useRef } from 'react';
import {
  PartialAutoScrollOptions,
  AutoScrollOptions,
} from './autoscroll-config-types';

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

export default function useAutoScrollConfig(config?: PartialAutoScrollOptions) {
  // using useRef to persist between renders
  const autoScrollConfigRef = useRef<AutoScrollOptions>({
    ...defaultAutoScrollOptions,
    ...config,
    durationDampening: {
      ...defaultAutoScrollOptions.durationDampening,
      ...config?.durationDampening,
    },
  });

  function updateAutoScrollConfig(newConfig?: PartialAutoScrollOptions) {
    autoScrollConfigRef.current = {
      ...autoScrollConfigRef.current,
      ...newConfig,
      durationDampening: {
        ...autoScrollConfigRef.current.durationDampening,
        ...newConfig?.durationDampening,
      },
    };
  }

  return {
    autoScrollConfigRef,
    updateAutoScrollConfig,
  };
}
