import React, { ReactElement, SyntheticEvent } from 'react';
import styled from '@emotion/styled';
import { grid } from '../constants';
import { PartialAutoScrollOptions } from '../../../src/state/auto-scroller/fluid-scroller/autoscroll-config-types';

const SetterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 10vh;
  justify-content: center;
  align-items: center;
  padding-bottom: ${grid}px;
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-tiems: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  height: 3vh;
  justify-content: space-around;
  margin: 0;
  margin-left: 2px;
  margin-right: 2px;
`;

const Input = styled.input`
  width: 15ch;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-tiems: center;
  margin-top: 10px;
`;

const Select = styled.select`
  width: 15ch;
  margin: 2px;
`;

interface SetterProps {
  autoScrollOptions: PartialAutoScrollOptions;
  changeAutoScrollOptions: React.Dispatch<
    React.SetStateAction<PartialAutoScrollOptions>
  >;
}

export default function AutoScrollOptionsSetter(
  props: SetterProps,
): ReactElement {
  function selectEase(option?: string) {
    if (option === 'quadratic') {
      return (x: number): number => x ** 2;
    }

    if (option === 'cubic') {
      return (x: number): number => x ** 3;
    }

    return (x: number): number => x;
  }

  function selectDisabled(option?: string) {
    if (option === 'yes') {
      return true;
    }

    return false;
  }

  return (
    <SetterContainer>
      <TopContainer>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // percentage of window from which to start scrolling
            const percent = parseFloat(e.target[0].value);

            if (percent < 0 || percent > 1 || isNaN(percent)) {
              alert(
                'Percentage of window from which to start scrolling must be between 0 and 1 inclusive',
              );
              e.target[0].value = '';
              return;
            }

            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              startFromPercentage: percent,
            });
          }}
        >
          <label htmlFor="percent">startFromPercentage:</label>
          <Input id="percent" type="text" name="percent"></Input>
        </Form>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // percentage of window at which max scroll speed is achieved
            const percent = parseFloat(e.target[0].value);

            if (isNaN(percent) || percent < 0 || percent > 1) {
              alert(
                'Percentage of window at which max scroll speed is achieved must be between 0 and 1 inclusive',
              );
              e.target[0].value = '';
              return;
            }

            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              maxScrollAtPercentage: percent,
            });
          }}
        >
          <label htmlFor="percent">maxScrollAtPercentage:</label>
          <Input id="percent" type="text" name="percent"></Input>
        </Form>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // max pixel scroll speed in pixels per second
            const val = parseFloat(e.target[0].value);
            if (isNaN(val)) {
              alert('Max pixel scroll speed must be a number');
              e.target[0].value = '';
              return;
            }

            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              maxPixelScroll: val,
            });
          }}
        >
          <label htmlFor="pixelScroll">maxPixelScroll:</label>
          <Input id="pixelScroll" type="text" name="pixelScroll"></Input>
        </Form>
      </TopContainer>
      <BottomContainer>
        ease:
        <Select
          onChange={(e) =>
            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              ease: selectEase(e.target.value),
            })
          }
        >
          <option>linear</option>
          <option>quadratic</option>
          <option>cubic</option>
        </Select>
        disabled:
        <Select
          onChange={(e) =>
            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              disabled: selectDisabled(e.target.value),
            })
          }
        >
          <option>no</option>
          <option>yes</option>
        </Select>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // time after drag starts at which dampening stops
            const val = parseFloat(e.target[0].value);

            if (isNaN(val) || val < 0) {
              alert(
                'Total time to dampen auto scroll speed should be a positive number of milliseconds',
              );
              e.target[0].value = '';
              return;
            }

            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              durationDampening: {
                ...props.autoScrollOptions.durationDampening,
                stopDampeningAt: val,
              },
            });
          }}
        >
          <label htmlFor="stop-dampening">stopDampeningAt:</label>
          <Input id="stop-dampening" type="text" name="stop-dampening"></Input>
        </Form>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // time after drag startups, at which to start accelerating the reduction in dampening
            const val = parseFloat(e.target[0].value);
            if (isNaN(val)) {
              alert(
                'Time at which to start accelerating reduction of dampening should be a position number of millseconds',
              );
              e.target[0].value = '';
              return;
            }

            props.changeAutoScrollOptions({
              ...props.autoScrollOptions,
              durationDampening: {
                ...props.autoScrollOptions.durationDampening,
                accelerateAt: val,
              },
            });
          }}
        >
          <label htmlFor="pixelScroll">accelerateAt:</label>
          <Input id="pixelScroll" type="text" name="pixelScroll"></Input>
        </Form>
      </BottomContainer>
    </SetterContainer>
  );
}
