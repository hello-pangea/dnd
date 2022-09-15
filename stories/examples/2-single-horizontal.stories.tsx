import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';
import AuthorApp from '../src/horizontal/author-app';
import { getQuotes } from '../src/data';

const generateBigData = () => getQuotes(30);

const WideWindow = styled.div`
  width: 120vw;
`;

storiesOf('Examples/single horizontal list', module)
  .add('simple', () => <AuthorApp initial={getQuotes()} />)
  .add('with combine enabled', () => (
    <AuthorApp initial={getQuotes()} isCombineEnabled />
  ))
  .add('with overflow scroll', () => (
    <AuthorApp initial={generateBigData()} internalScroll />
  ))
  .add('with window scroll and overflow scroll', () => (
    <WideWindow>
      <AuthorApp initial={generateBigData()} internalScroll />
    </WideWindow>
  ));
