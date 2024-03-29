import * as keyCodes from '../../../key-codes';

interface KeyMap {
  [key: number]: true;
}

const preventedKeys: KeyMap = {
  // submission
  [keyCodes.enter]: true,
  // tabbing
  [keyCodes.tab]: true,
};

export default (event: KeyboardEvent) => {
  if (preventedKeys[event.keyCode]) {
    event.preventDefault();
  }
};
