import type { ReactWrapper } from 'enzyme';

// wrapper.update() no longer forces a render
// instead using wrapper.setProps({});
// https://github.com/airbnb/enzyme/issues/1245

// to remove
export default (wrapper: ReactWrapper<any>) => wrapper.setProps({});
