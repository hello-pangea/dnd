import React from 'react';
import styled from '@emotion/styled';
import AuthorApp from '../src/horizontal/author-app';
import { getQuotes } from '../src/data';

const generateBigData = () => getQuotes(30);

const WideWindow = styled.div`
  width: 120vw;
`;

export default {
  title: 'Examples/single horizontal list',
};

export const Simple = {
  render: () => <AuthorApp initial={getQuotes()} />,
  name: 'simple',
};

export const WithCombineEnabled = {
  render: () => <AuthorApp initial={getQuotes()} isCombineEnabled />,

  name: 'with combine enabled',
};

export const WithOverflowScroll = {
  render: () => <AuthorApp initial={generateBigData()} internalScroll />,

  name: 'with overflow scroll',
};

export const WithWindowScrollAndOverflowScroll = {
  render: () => (
    <WideWindow>
      <AuthorApp initial={generateBigData()} internalScroll />
    </WideWindow>
  ),

  name: 'with window scroll and overflow scroll',
};
