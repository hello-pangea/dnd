import React from 'react';
import { storiesOf } from '@storybook/react';
import PortalApp from '../src/portal/portal-app';
import { getQuotes } from '../src/data';

storiesOf('Examples/Portals', module).add('Using your own portal', () => (
  <PortalApp initial={getQuotes().slice(0, 2)} />
));
