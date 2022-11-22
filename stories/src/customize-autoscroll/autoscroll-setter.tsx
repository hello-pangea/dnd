/* eslint-disable no-alert */
import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { grid } from '../constants';
import { PartialAutoScrollerOptions } from '../../../src/state/auto-scroller/fluid-scroller/auto-scroller-options-types';
import { defaultAutoScrollerOptions } from '../../../src/state/auto-scroller/fluid-scroller/config';

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
  align-items: center;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const Select = styled.select`
  width: 15ch;
  margin: 2px;
`;

interface SetterProps {
  autoScrollerOptions: PartialAutoScrollerOptions;
  changeAutoScrollOptions: React.Dispatch<
    React.SetStateAction<PartialAutoScrollerOptions>
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
                  ...props.autoScrollerOptions,
                  startFromPercentage:
                    defaultAutoScrollerOptions.startFromPercentage,
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
                ...props.autoScrollerOptions,
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
                  ...props.autoScrollerOptions,
                  maxScrollAtPercentage:
                    defaultAutoScrollerOptions.maxScrollAtPercentage,
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
                ...props.autoScrollerOptions,
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
                  ...props.autoScrollerOptions,
                  maxPixelScroll: defaultAutoScrollerOptions.maxPixelScroll,
                });

                return;
              }

              props.changeAutoScrollOptions({
                ...props.autoScrollerOptions,
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
              ...props.autoScrollerOptions,
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
              ...props.autoScrollerOptions,
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
                  ...props.autoScrollerOptions,
                  durationDampening: {
                    ...props.autoScrollerOptions.durationDampening,
                    stopDampeningAt:
                      defaultAutoScrollerOptions.durationDampening
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
                ...props.autoScrollerOptions,
                durationDampening: {
                  ...props.autoScrollerOptions.durationDampening,
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
                  ...props.autoScrollerOptions,
                  durationDampening: {
                    ...props.autoScrollerOptions.durationDampening,
                    accelerateAt:
                      defaultAutoScrollerOptions.durationDampening.accelerateAt,
                  },
                });

                return;
              }

              props.changeAutoScrollOptions({
                ...props.autoScrollerOptions,
                durationDampening: {
                  ...props.autoScrollerOptions.durationDampening,
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
