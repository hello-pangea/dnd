module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['accessibility'],
    skipAudits: ['bypass'],
  },
  passes: [
    {
      passName: 'defaultPass',
      recordTrace: false,
      gatherers: ['accessibility'],
    },
  ],
};
