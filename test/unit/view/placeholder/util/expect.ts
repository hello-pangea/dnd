import { placeholder } from './data';

export const expectIsEmpty = (style: CSSStyleDeclaration | null): void => {
  expect(style?.width).toBe('0px');
  expect(style?.height).toBe('0px');
  expect(style?.marginTop).toBe('0px');
  expect(style?.marginRight).toBe('0px');
  expect(style?.marginBottom).toBe('0px');
  expect(style?.marginLeft).toBe('0px');
};

export const expectIsFull = (style: CSSStyleDeclaration | null): void => {
  expect(style?.width).toBe(`${placeholder.client.borderBox.width}px`);
  expect(style?.height).toBe(`${placeholder.client.borderBox.height}px`);
  expect(style?.marginTop).toBe(`${placeholder.client.margin.top}px`);
  expect(style?.marginRight).toBe(`${placeholder.client.margin.right}px`);
  expect(style?.marginBottom).toBe(`${placeholder.client.margin.bottom}px`);
  expect(style?.marginLeft).toBe(`${placeholder.client.margin.left}px`);
};
