interface ProcessEnv {
  NODE_ENV: 'development' | 'production';
}

interface Process {
  env: ProcessEnv;
}

declare global {
  type AnimationFrameID = number;
  type TimeoutID = number;
  type IntervalID = number;

  const process: Process;

  interface Window {
    '__@react-forked/dnd-disable-dev-warnings'?: boolean;
  }
}

export {};
