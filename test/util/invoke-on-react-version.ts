import getReactMajorVersion from './get-react-major-version';

export default function invokeOnReactVersion(
  reactVersion: Array<'16' | '17' | '18'>,
  callback: () => void,
) {
  if (reactVersion.includes(getReactMajorVersion())) {
    callback();
  }
}
