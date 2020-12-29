import { create } from '@storybook/theming';
import logo from './compressed-logo-rfd.svg';

const brandTitle = `
  <span
    style="display:flex;align-items:center"
    title="@react-forked/dnd"
  >
    <img
      alt="Logo of @react-forked/dnd"
      src="${logo}"
      style="display:block;width:auto;height:42px;max-width:100%"
    />
    <span style="margin-left:8px;color:#0BAF7C;font-family:monospace;font-size:26px">
      rfd
    </span>
  </span>
`;

export default create({
  base: 'light',
  brandTitle,
  brandUrl: 'https://github.com/react-forked/dnd',
});
