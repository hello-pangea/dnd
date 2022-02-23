/* eslint-disable no-console */
import React, { useState, useCallback, useEffect, ReactElement } from 'react';
import type {
  DropResult,
  PreDragActions,
  SnapDragActions,
  SensorAPI,
} from '@react-forked/dnd';
import { DragDropContext } from '@react-forked/dnd';
import type { Quote } from '../types';
import QuoteList from '../primatives/quote-list';
import reorder from '../reorder';

function delay(fn: () => void, time = 300) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}

function useDemoSensor(api: SensorAPI) {
  const start = useCallback(
    async function start() {
      const preDrag: PreDragActions | undefined | null = api.tryGetLock('1');

      if (!preDrag) {
        console.warn('unable to start drag');
        return;
      }
      console.warn('starting drag');

      const actions: SnapDragActions = preDrag.snapLift();
      const { moveDown, moveUp, drop } = actions;

      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveDown);
      await delay(moveUp);
      await delay(moveUp);
      await delay(drop);
    },
    [api],
  );

  useEffect(() => {
    start();
  }, [start]);
}

interface Props {
  initial: Quote[];
}

export default function QuoteApp(props: Props): ReactElement {
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
    <DragDropContext onDragEnd={onDragEnd} sensors={[useDemoSensor]}>
      <QuoteList listId="list" quotes={quotes} />
    </DragDropContext>
  );
}
