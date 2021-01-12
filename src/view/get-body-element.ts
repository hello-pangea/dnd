import { invariant } from '../invariant';

export default (): HTMLBodyElement => {
  const body: HTMLBodyElement | undefined | null = document.body;
  invariant(body, 'Cannot find document.body');
  return body;
};
