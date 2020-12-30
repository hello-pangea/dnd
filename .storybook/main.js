module.exports = {
  addons: ['storybook-addon-performance/register'],
  check: true,
  checkOptions: {
    tsconfig: '../stories/tsconfig.json',
  },
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
};
