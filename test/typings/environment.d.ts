interface ProcessEnv {
  NODE_ENV?: 'development' | 'production';
  REACT_MAJOR_VERSION?: '16' | '17' | '18';
  CI?: boolean;
}

interface Process {
  env: ProcessEnv;
}
