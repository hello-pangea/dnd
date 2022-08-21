export default function getReactMajorVersion(): '16' | '17' | '18' {
  return process.env.REACT_MAJOR_VERSION || '18';
}
