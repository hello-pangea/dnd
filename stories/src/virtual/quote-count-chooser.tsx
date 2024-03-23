import React, { ChangeEvent, ReactElement } from 'react';
import { colors } from '@atlaskit/theme';
import { grid, borderRadius } from '../constants';

interface Props {
  library: string;
  count: number;
  onCountChange: (count: number) => void;
}

interface Option {
  name: string;
  value: number;
}

const options: Option[] = [
  { name: 'Small', value: 8 },
  { name: 'Medium', value: 500 },
  { name: 'Large', value: 10000 },
];

export default function QuoteCountChooser(props: Props): ReactElement {
  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = Number(event.target.value);
    props.onCountChange(value);
  }

  return (
    <div
      style={{
        backgroundColor: `${colors.N0}`,
        padding: `${grid}px`,
        borderRadius: `${borderRadius}px`,
        width: `200px`,
        display: `flex`,
        flexDirection: `column`,
        marginLeft: `${grid}px`,
      }}
    >
      <h4
        style={{
          marginBottom: `${grid}px`,
        }}
      >
        <code>{props.library}</code>
      </h4>
      <select
        onChange={onChange}
        value={props.count}
        style={{
          fontSize: '16px',
        }}
      >
        {options.map((option: Option) => (
          <option key={option.name} value={option.value}>
            {option.name} ({option.value})
          </option>
        ))}
      </select>
    </div>
  );
}
