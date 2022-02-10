type Props<T extends unknown = unknown> = {
  [K in keyof T]: T[K];
} & {
  children: (value: Omit<T, 'children'>) => JSX.Element;
};

export default function PassThroughProps<T extends unknown = unknown>(
  props: Props<T>,
): JSX.Element {
  const { children, ...rest } = props;

  return children(rest);
}
