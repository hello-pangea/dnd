/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import React, { useState, useEffect, ReactElement } from 'react';
import styled from '@emotion/styled';
import { useCallback } from 'use-memo-one';
import type { Quote } from '../types';
import type {
  DropResult,
  PreDragActions,
  SnapDragActions,
  Sensor,
  SensorAPI,
} from '../../../src';
import { quotes as initial } from '../data';
import { DragDropContext } from '../../../src';
import QuoteList from '../primatives/quote-list';
import reorder from '../reorder';
import bindEvents from '../../../src/view/event-bindings/bind-events';
import { grid } from '../constants';

function sleep(fn: () => void, time = 300) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}

function getSensor(delay: number): Sensor {
  return function useCustomSensor(api: SensorAPI) {
    const start = useCallback(
      async function start() {
        const preDrag: PreDragActions | undefined | null = api.tryGetLock('1');

        if (!preDrag) {
          console.warn('unable to start drag');
          return;
        }

        const actions: SnapDragActions = preDrag.snapLift();
        const { moveDown, moveUp, drop, isActive, cancel } = actions;

        const unbind = bindEvents(window, [
          {
            eventName: 'resize',
            fn: () => cancel(),
            options: { once: true },
          },
        ]);

        for (let i = 0; i < 20 && isActive(); i++) {
          await sleep(() => {
            // might no longer be active after delay
            if (!isActive()) {
              return;
            }
            if (i % 2 === 0) {
              moveDown();
            } else {
              moveUp();
            }
          }, delay);
        }

        if (isActive()) {
          await sleep(drop, delay);
        }

        unbind();
      },
      [api],
    );

    useEffect(() => {
      start();
    }, [start]);
  };
}

interface Props {
  initial: Quote[];
  sensors?: Sensor[];
}

function QuoteApp(props: Props) {
  const [quotes, setQuotes] = useState(props.initial);

  const onDragEnd = useCallback(
    function onDragEnd(result: DropResult) {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const newQuotes = reorder(
        quotes,
        result.source.index,
        result.destination.index,
      );

      setQuotes(newQuotes);
    },
    [quotes],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd} sensors={props.sensors}>
      <QuoteList listId="list" quotes={quotes} />
    </DragDropContext>
  );
}

const Root = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Column = styled.div``;

const Title = styled.h3`
  text-align: center;
  padding: ${grid * 2}px;
`;

export default function App(): ReactElement {
  return (
    <Root>
      <Column>
        <Title>
          Programmatic #1{' '}
          <span role="img" aria-label="controller">
            🎮
          </span>
        </Title>
        <QuoteApp initial={initial} sensors={[getSensor(300)]} />
      </Column>
      <Column>
        <Title>
          Programmatic #2{' '}
          <span role="img" aria-label="controller">
            🎮
          </span>
        </Title>
        <QuoteApp initial={initial} sensors={[getSensor(400)]} />
      </Column>
      <Column>
        <Title>
          User controlled{' '}
          <span role="img" aria-label="hand">
            🤚
          </span>
        </Title>
        <QuoteApp initial={initial} />
      </Column>
    </Root>
  );
}
