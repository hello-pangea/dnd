interface ProcessEnv {
  NODE_ENV?: 'development' | 'production';
  CI?: boolean;
}

interface Process {
  env: ProcessEnv;
}
