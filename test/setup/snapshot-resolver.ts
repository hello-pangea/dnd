import path from 'path';
import getReactMajorVersion from '../util/get-react-major-version';

// resolve snapshot folder with the react version
// __react_16_snapshots__, __react_17_snapshots__, etc.
export default {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => {
    const breadcrumb = testPath.split(path.sep);
    const filename = breadcrumb.pop();
    const reactMajorVersion = getReactMajorVersion();

    return (
      [
        ...breadcrumb,
        `__react_${reactMajorVersion}_snapshots__`,
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
