// ensuring that each test has at least one assertion
beforeEach(() => {
  expect.hasAssertions();
});

if (typeof document !== 'undefined') {
  // Simply importing this package will throw an error if document is not defined
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { cleanup, fireEvent } = require('@testing-library/react');

  // unmount any components mounted with react-testing-library
  beforeAll(cleanup);
  afterEach(() => {
    cleanup();
    // lots of tests can leave a post-drop click blocker
    // this cleans it up before every test
    fireEvent.click(window);
  });
}

export default {};
