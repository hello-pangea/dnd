import React from 'react';
import TableWithDimensionLocking from '../src/table/with-dimension-locking';
import TableWithFixedColumns from '../src/table/with-fixed-columns';
import TableWithPortal from '../src/table/with-portal';
import TableWithClone from '../src/table/with-clone';
import { getQuotes } from '../src/data';

export default {
  title: 'Examples/Tables',
};

export const WithFixedWidthColumns = {
  render: () => <TableWithFixedColumns initial={getQuotes()} />,

  name: 'with fixed width columns',
};

export const WithDimensionLocking = {
  render: () => <TableWithDimensionLocking initial={getQuotes()} />,

  name: 'with dimension locking',
};

export const WithClone = {
  render: () => <TableWithClone initial={getQuotes()} />,
  name: 'with clone',
};

export const WithCustomPortal = {
  render: () => <TableWithPortal initial={getQuotes()} />,
  name: 'with custom portal',
};
