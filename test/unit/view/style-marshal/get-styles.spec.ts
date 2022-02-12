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
            // Temporaly disabled, because of an issue with this rule
            // See: - https://github.com/stylelint/stylelint/issues/5904
            //      - https://github.com/niksy/css-functions-list/issues/2
            'function-no-unknown': null,

            'no-extra-semicolons': true,
            'declaration-block-semicolon-space-after': 'always-single-line',
          },
        },
      })
      .then((result) => {
        expect(result.errored).toBe(false);

        // asserting that some CSS was actually generated!
        expect(
          // Types on _postcssResult are not properly working,
          // because the `css` is not avalaible
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-underscore-dangle
          (result.results[0]._postcssResult as any)?.css.length,
        ).toBeGreaterThan(1);
      }));
});
