export default function createRef() {
  let ref: HTMLElement | undefined | null = null;

  const setRef = (supplied?: HTMLElement | null) => {
    ref = supplied;
  };

  const getRef = (): HTMLElement | undefined | null => ref;

  return { ref, setRef, getRef };
}
