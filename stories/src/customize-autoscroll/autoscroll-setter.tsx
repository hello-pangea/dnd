/* eslint-disable no-alert */
import React, { ReactElement, SyntheticEvent } from 'react';
import styled from '@emotion/styled';
import { grid } from '../constants';
import { PartialAutoScrollOptions } from '../../../src/state/auto-scroller/fluid-scroller/autoscroll-config-types';
import { defaultAutoScrollOptions } from '../../../src/state/auto-scroller/fluid-scroller/config';

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
        <label htmlFor="percent">
          startFromPercentage:
          <input
            id="percent"
            type="number"
            name="percent"
            onChange={(event) => {
              event.preventDefault();
              // percentage of window from which to start scrolling
              const percent = parseFloat(event.currentTarget.value);

              if (Number.isNaN(percent)) {
                event.currentTarget.value = '';

                props.changeAutoScrollOptions({
                  ...props.autoScrollOptions,
                  startFromPercentage:
                    defaultAutoScrollOptions.startFromPercentage,
                });

                return;
              }

              if (percent < 0 || percent > 1) {
                alert(
                  'Percentage of window from which to start scrolling must be between 0 and 1 inclusive',
                );
                event.currentTarget.value = '';
                return;
              }

              props.changeAutoScrollOptions({
                ...props.autoScrollOptions,
                startFromPercentage: percent,
              });
            }}
          />
        </label>
        <label htmlFor="percent">
          maxScrollAtPercentage:
          <input
            id="percent"
            type="number"
            name="percent"
            onChange={(event) => {
              event.preventDefault();
              // percentage of window at which max scroll speed is achieved
              const percent = parseFloat(event.currentTarget.value);

              if (Number.isNaN(percent)) {
                event.currentTarget.value = '';

                props.changeAutoScrollOptions({
                  ...props.autoScrollOptions,
                  maxScrollAtPercentage:
                    defaultAutoScrollOptions.maxScrollAtPercentage,
                });

                return;
              }

              if (percent < 0 || percent > 1) {
                alert(
                  'Percentage of window at which max scroll speed is achieved must be between 0 and 1 inclusive',
                );
                event.currentTarget.value = '';
                return;
              }

              props.changeAutoScrollOptions({
                ...props.autoScrollOptions,
                maxScrollAtPercentage: percent,
              });
            }}
          />
        </label>
        <label htmlFor="pixelScroll">
          maxPixelScroll:
          <input
            id="pixelScroll"
            type="number"
            name="pixelScroll"
            onChange={(event) => {
              const val = parseFloat(event.currentTarget.value);
              if (Number.isNaN(val)) {
                event.currentTarget.value = '';

                props.changeAutoScrollOptions({
                  ...props.autoScrollOptions,
                  maxPixelScroll: defaultAutoScrollOptions.maxPixelScroll,
                });

                return;
              }

              props.changeAutoScrollOptions({
                ...props.autoScrollOptions,
                maxPixelScroll: val,
              });
            }}
          />
        </label>
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
        <label htmlFor="stop-dampening">
          stopDampeningAt:
          <input
            id="stop-dampening"
            type="number"
            name="stop-dampening"
            onChange={(event) => {
              event.preventDefault();
              // time after drag starts at which dampening stops
              const val = parseFloat(event.currentTarget.value);

              if (Number.isNaN(val)) {
                event.currentTarget.value = '';

                props.changeAutoScrollOptions({
                  ...props.autoScrollOptions,
                  durationDampening: {
                    ...props.autoScrollOptions.durationDampening,
                    stopDampeningAt:
                      defaultAutoScrollOptions.durationDampening
                        .stopDampeningAt,
                  },
                });

                return;
              }

              if (val < 0) {
                alert(
                  'Total time to dampen auto scroll speed should be a positive number of milliseconds',
                );
                event.currentTarget.value = '';
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
          />
        </label>
        <label htmlFor="pixelScroll">
          accelerateAt:
          <input
            id="pixelScroll"
            type="number"
            name="pixelScroll"
            onChange={(event) => {
              event.preventDefault();
              // time after drag startups, at which to start accelerating the reduction in dampening
              const val = parseFloat(event.currentTarget.value);
              if (Number.isNaN(val)) {
                event.currentTarget.value = '';

                props.changeAutoScrollOptions({
                  ...props.autoScrollOptions,
                  durationDampening: {
                    ...props.autoScrollOptions.durationDampening,
                    accelerateAt:
                      defaultAutoScrollOptions.durationDampening.accelerateAt,
                  },
                });

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
          />
        </label>
      </BottomContainer>
    </SetterContainer>
  );
}
