const a11yReport = require('./test-reports/lighthouse/a11y.report.json');

const a11yScore = a11yReport.categories.accessibility.score;
const a11yScoreFormatted = `${a11yScore ? a11yScore * 100 : 0}%`;

/* eslint-disable no-console */
console.log('*************************');
console.log('Lighthouse accessibility score: ', a11yScoreFormatted);
console.log('*************************');
/* eslint-enable no-console */

if (a11yScore !== 1) {
  // fail build
  // eslint-disable-next-line no-restricted-syntax
  throw new Error(
    'NOTE: Lighthouse accessibility audit score must be 100% to pass this build step.',
  );
}
