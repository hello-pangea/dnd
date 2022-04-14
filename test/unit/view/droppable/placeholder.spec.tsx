import { render } from '@testing-library/react';
import React from 'react';
import App from './util/app';
import {
  foreignOwnProps,
  isOverForeign,
  homeOwnProps,
  isOverHome,
  isNotOverHome,
  homeAtRest,
  isNotOverForeign,
} from './util/get-props';

describe('home list', () => {
  it('should not render a placeholder when not dragging', () => {
    const { container } = render(
      <App ownProps={homeOwnProps} mapProps={homeAtRest} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(0);
  });

  it('should render a placeholder when dragging over', () => {
    const { container } = render(
      <App ownProps={homeOwnProps} mapProps={isOverHome} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(1);
  });

  it('should render a placeholder when dragging over nothing', () => {
    const { container } = render(
      <App ownProps={homeOwnProps} mapProps={isNotOverHome} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(1);
  });

  it('should render a placeholder when dragging over a foreign list', () => {
    const { container } = render(
      <App ownProps={homeOwnProps} mapProps={isOverForeign} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(1);
  });
});

describe('foreign', () => {
  it('should not render a placeholder when not dragging', () => {
    const { container } = render(
      <App ownProps={foreignOwnProps} mapProps={homeAtRest} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(0);
  });

  it('should render a placeholder when dragging over', () => {
    const { container } = render(
      <App ownProps={foreignOwnProps} mapProps={isOverForeign} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(1);
  });

  it('should not render a placeholder when over nothing', () => {
    const { container } = render(
      <App ownProps={foreignOwnProps} mapProps={isNotOverForeign} />,
    );

    expect(
      container.querySelectorAll('[data-rfd-placeholder-context-id]'),
    ).toHaveLength(0);
  });
});
