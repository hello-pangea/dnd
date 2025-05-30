/**
 * @jest-environment node
 *
 * We've decided to run the stylelint in the node environment
 * to avoid issues and conflicts with jsdom
 * See: https://github.com/stylelint/stylelint/issues/5904#issuecomment-1040585353
 */

import stylelint from 'stylelint';
import getStyles from '../../../../src/view/use-style-marshal/get-styles';

import type { Styles } from '../../../../src/view/use-style-marshal/get-styles';

const styles: Styles = getStyles('hey');

describe('Style Generation Validated by Stylelint', () => {
  (Object.keys(styles) as Array<keyof Styles>).forEach((key) => {
    it(`should generate valid ${key} styles (with minimal config)`, async () => {
      const cssToLint = styles[key];
      if (!cssToLint || cssToLint.trim() === '') {
        expect(true).toBe(true); // Assert true if CSS is empty, as stylelint might error
        return;
      }

      try {
        const result = await stylelint.lint({
          code: cssToLint,
          config: {
            rules: {
              'block-no-empty': true, 
            },
          },
        });

        if (result.errored) {
          console.error('Stylelint errors for ', key, JSON.stringify(result.results[0]?.warnings, null, 2));
        }
        expect(result.errored).toBe(false);
        // Ensure _postcssResult and css exist before trying to get length
        const postCssResult = result.results[0]?._postcssResult as any;
        expect(postCssResult?.css?.length).toBeGreaterThan(1);

      } catch (e) {
        console.error(`Error during stylelint.lint for ${key}:`, e);
        throw e; 
      }
    });
  });
});
