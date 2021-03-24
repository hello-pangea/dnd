declare type AnimationFrameID = number;
declare type TimeoutID = number;
declare type IntervalID = number;

interface ProcessEnv {
  NODE_ENV: 'development' | 'production';
}

interface Process {
  env: ProcessEnv;
}

declare const process: Process;

declare interface Window {
  '__@react-forked/dnd-disable-dev-warnings'?: boolean;
}