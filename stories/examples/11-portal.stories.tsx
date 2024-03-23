import React from 'react';
import PortalApp from '../src/portal/portal-app';
import { getQuotes } from '../src/data';

export default {
  title: 'Examples/Portals',
};

export const UsingYourOwnPortal = {
  render: () => <PortalApp initial={getQuotes().slice(0, 2)} />,

  name: 'Using your own portal',
};
