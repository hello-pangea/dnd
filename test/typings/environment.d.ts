interface ProcessEnv {
  CI?: boolean;
  NODE_ENV?: 'development' | 'production';
  REACT_MAJOR_VERSION?: '18' | '19';
}

interface Process {
  env: ProcessEnv;
}
