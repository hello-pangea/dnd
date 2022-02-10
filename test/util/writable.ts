type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

export default function writable<TValue>(value: TValue): Writeable<TValue> {
  return value as Writeable<TValue>;
}
