export default function getReactMajorVersion(): '18' | '19' {
  return process.env.REACT_MAJOR_VERSION || '19';
}
