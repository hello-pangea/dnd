import stylelint from 'stylelint';
import getStyles from '../../../../src/view/use-style-marshal/get-styles';

import type { Styles } from '../../../../src/view/use-style-marshal/get-styles';

const styles: Styles = getStyles('hey');

(Object.keys(styles) as Array<keyof Styles>).forEach((key) => {
  it(`should generate valid ${key} styles`, () =>
    stylelint
      .lint({
        code: styles[key],
        config: {
          // just using the recommended config as it only checks for errors and not formatting
          extends: ['stylelint-config-recommended'],
          // basic semi colin rules
          rules: {
            'no-extra-semicolons': true,
            'declaration-block-semicolon-space-after': 'always-single-line',
          },
        },
      })
      .then((result) => {
        expect(result.errored).toBe(false);
        // asserting that some CSS was actually generated!
        expect(
          // eslint-disable-next-line no-underscore-dangle
          (result.results[0] as any)._postcssResult.css.length,
        ).toBeGreaterThan(1);
      }));
});
