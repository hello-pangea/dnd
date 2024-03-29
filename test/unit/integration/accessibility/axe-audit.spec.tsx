import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import App from '../util/app';

expect.extend(toHaveNoViolations);

// Need to investigate this further as it doesn't seem to pick up the same errors
// which are found by react-axe.
it('should not fail an aXe audit', async () => {
  render(<App />);

  const results = await axe(document.body);

  expect(results).toHaveNoViolations();

  cleanup();
});
