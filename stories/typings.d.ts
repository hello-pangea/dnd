declare module '*.png' {
  const src: string;
  export default src;
}

// override react-virtualized's types, because the current version
// uses react 17 types
declare module 'react-virtualized' {
  import { FunctionComponent } from 'react';
  import { ListProps, WindowScrollerProps } from 'react-virtualized';

  export * from 'react-virtualized';

  export const List: FunctionComponent<ListProps>;
  export const WindowScroller: FunctionComponent<WindowScrollerProps>;
}
