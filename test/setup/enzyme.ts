/* eslint-disable global-require */
// setting up global enzyme
import Enzyme from 'enzyme';

declare global {
  interface ProcessEnv {
    REACT_VERSION?: string;
  }
}

function getAdapter() {
  if (process.env.REACT_VERSION === '16') {
    return require('enzyme-adapter-react-16');
  }
  return require('@wojtekmaj/enzyme-adapter-react-17');
}

const Adapter = getAdapter();

Enzyme.configure({ adapter: new Adapter() });
