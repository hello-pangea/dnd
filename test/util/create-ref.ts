export default function createRef() {
  let ref: HTMLElement | null = null;

  const setRef = (supplied: HTMLElement | null = null) => {
    ref = supplied;
  };

  const getRef = (): HTMLElement | null => ref;

  return { ref, setRef, getRef };
}
