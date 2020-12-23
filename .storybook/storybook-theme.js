import { create } from '@storybook/theming/create';
import logo from './compressed-logo-rfd.svg';
import { grid } from '../stories/src/constants';

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
    <span style="margin-left:${grid}px;color:#0BAF7C;font-family:monospace;font-size:26px">
      rfd
    </span>
  </span>
`;

export default create({
  // Setting brandImage to null allows inline HTML in the brandTitle
  // https://github.com/storybookjs/storybook/blob/60484892f8a4edd044b0a4ee79c99ad0d35a6658/lib/ui/src/components/sidebar/Brand.tsx#L38-L44
  brandImage: null,
  brandName: '@react-forked/dnd',
  brandTitle,
  brandUrl: 'https://github.com/react-forked/dnd',
});
