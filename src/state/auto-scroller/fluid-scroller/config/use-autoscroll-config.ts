import { useRef } from "react";
import { PartialAutoScrollConfig, AutoScrollConfig } from "./autoscroll-config-types";

// default autoScroll configuration options
const defaultAutoScrollConfig: AutoScrollConfig = {
  startFromPercentage: 0.25,
  maxScrollAtPercentage: 0.05,
  maxPixelScroll: 28,
  ease: (percentage: number): number => percentage ** 2,
  durationDampening: {
    stopDampeningAt: 1200,
    accelerateAt: 360,
  },
  disabled: false
};

export default function useAutoScrollConfig(config?: PartialAutoScrollConfig) {
  // using useRef to persist between renders
  const autoScrollConfigRef = useRef<AutoScrollConfig>({
    ...defaultAutoScrollConfig,
    ...config
  });

  function updateAutoScrollConfig(newConfig?: PartialAutoScrollConfig) {
    autoScrollConfigRef.current = {
      ...autoScrollConfigRef.current,
      ...newConfig
    };
  }

  return {
    autoScrollConfigRef,
    updateAutoScrollConfig
  };
}
