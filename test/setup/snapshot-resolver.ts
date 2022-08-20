import path from 'path';

export default {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => {
    const breadcrumb = testPath.split(path.sep);
    const filename = breadcrumb.pop();

    return (
      [
        ...breadcrumb,
        `__react_${process.env.REACT_MAJOR_VERSION}_snapshots__`,
        filename,
      ].join(path.sep) + snapshotExtension
    );
  },

  // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) =>
    snapshotFilePath
      .replace(/__react_[0-9]+_snapshots__[\\/]/, '')
      .slice(0, -snapshotExtension.length),

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: 'some/example.test.ts',
};
