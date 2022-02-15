// Since we are in a "browser" environment the setImmediate
// was missing for some node libraries that needs it
import 'core-js/stable/set-immediate';

import './browser';
import './enzyme';
