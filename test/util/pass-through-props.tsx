import type { ReactNode } from 'react';

type Props<T> = {
  children: (value: T) => ReactNode;
} & T;

export default function PassThroughProps(props: Props<any>) {
  const { children, ...rest } = props;
  return children(rest);
}
