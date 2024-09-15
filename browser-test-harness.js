const childProcess = require('child_process');
const path = require('path');
const waitOn = require('wait-on');
const ports = require('./server-ports');

const storybook = childProcess.spawn(process.execPath, [
  path.resolve(
    __dirname,
    'node_modules',
    'cross-env',
    'src',
    'bin',
    'cross-env-shell.js',
  ),
  'DISABLE_HMR=true',
  'USE_PRODUCTION_BUILD=true',
  path.resolve(__dirname, 'node_modules', '.bin', 'storybook'),
  'dev',
  '--ci',
  '-p',
  `${ports.storybook}`,
]);

const cspServer = childProcess.spawn(process.execPath, [
  path.resolve(
    __dirname,
    'node_modules',
    'cross-env',
    'src',
    'bin',
    'cross-env-shell.js',
  ),
  'USE_PRODUCTION_BUILD=true',
  path.resolve(__dirname, 'csp-server', 'start.sh'),
  `${ports.cspServer}`,
]);

process.on('exit', () => {
  storybook.kill();
  cspServer.kill();
});

const cmdArgsMap = {
  accessibility: ['test:accessibility'],
  browser: ['test:browser:ci'],
};

waitOn({
  resources: [
    `http://localhost:${ports.storybook}`,
    `http://localhost:${ports.cspServer}`,
  ],
  timeout: 60000,
})
  .then(() => {
    if (!process.argv[2]) {
      // eslint-disable-next-line no-restricted-syntax
      throw new Error('Started servers but no command supplied to run after');
    }

    const args = cmdArgsMap[process.argv[2]];

    if (!args) {
      // eslint-disable-next-line no-restricted-syntax
      throw new Error('Unknown argument provided');
    }

    const child = childProcess.spawn('pnpm', args, {
      stdio: 'inherit',
    });

    process.on('exit', () => {
      child.kill();
    });

    child.on('exit', (code) => {
      // eslint-disable-next-line n/no-process-exit
      process.exit(code);
    });
  })
  .catch((error) => {
    storybook.kill();
    cspServer.kill();

    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line no-restricted-syntax
    throw new Error('Unable to spin up standalone servers');
  });
