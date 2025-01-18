import '@testing-library/jest-dom';

// ensuring that each test has at least one assertion
beforeEach(() => {
  // eslint-disable-next-line jest/no-standalone-expect
  expect.hasAssertions();
});

export default async () => {
  if (typeof document === 'undefined') {
    return;
  }

  // Simply importing this package will throw an error if document is not defined
  const { cleanup, fireEvent } = await import('@testing-library/react');

  // unmount any components mounted with react-testing-library
  beforeAll(cleanup);
  afterEach(() => {
    cleanup();
    // lots of tests can leave a post-drop click blocker
    // this cleans it up before every test
    fireEvent.click(window);
  });
};
