import React from 'react';
import { addParameters, configure, addDecorator } from '@storybook/react';
import { create } from '@storybook/theming';
import { withPerformance } from 'storybook-addon-performance';
import GlobalStylesDecorator from './custom-decorators/global-styles';
// adding css reset - storybook includes a css loader
import '@atlaskit/css-reset';
import { colors } from '@atlaskit/theme';
import logo from './compressed-logo-rfd.svg';
import { version } from '../package.json';

const theme = create({
  brandImage: logo,
  brandName: '@react-forked/dnd',
  brandUrl: 'https://github.com/react-forked/dnd',
});

addParameters({
  options: {
    // currently not using any addons
    showPanel: false,
    theme,
  },
});

// Using theme would be good for this, but it looks like theme is just for the chrome around the story
addDecorator(GlobalStylesDecorator);
addDecorator(withPerformance);

// automatically import all files ending in *.stories.js
const req = require.context('../stories/', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

// Doing this more complex check as console.table || console.log makes CI cry
const table = Object.prototype.hasOwnProperty.call(console, 'table')
  ? console.table
  : console.log;

// Generated by: http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow&t=rfd
console.log(
  `%c
██████╗ ███████╗██████╗
██╔══██╗██╔════╝██╔══██╗
██████╔╝█████╗  ██║  ██║
██╔══██╗██╔══╝  ██║  ██║
██║  ██║██║     ██████╔╝
╚═╝  ╚═╝╚═╝     ╚═════╝

%cBeautiful and accessible drag and drop
`,
  `color: ${colors.G200}; font-size: 1.2em; font-weight: bold;`,
  `color: ${colors.P200}; font-size: 1.2em; font-weight: bold;`,
);

table([
  ['@react-forked/dnd version', version],
  ['react version', React.version],
  ['process.env.NODE_ENV', process.env.NODE_ENV],
]);
