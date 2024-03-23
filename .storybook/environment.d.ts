interface ProcessEnv {
  DISABLE_HMR?: 'true' | 'false' | undefined;
  USE_PRODUCTION_BUILD?: 'true' | 'false' | undefined;
}

interface Process {
  env: ProcessEnv;
}
