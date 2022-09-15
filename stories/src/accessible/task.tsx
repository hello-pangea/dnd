import React, { Component, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import memoizeOne from 'memoize-one';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { Draggable } from '@hello-pangea/dnd';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { invariant } from '../../../src/invariant';
import type { Task as TaskType } from '../types';
import { grid, borderRadius } from '../constants';
import BlurContext from './blur-context';

interface Props {
  task: TaskType;
  index: number;
}

interface ContainerProps {
  blur: number;
  isDragging: boolean;
}

const Container = styled.div<ContainerProps>`
  border-bottom: 1px solid #ccc;
  background: ${colors.N0};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;
  font-size: 18px;
  filter: blur(${(props) => props.blur}px);
  ${({ isDragging }) =>
    isDragging ? 'box-shadow: 1px 1px 1px grey; background: lightblue' : ''};
`;

const getPortal = memoizeOne((): HTMLElement => {
  invariant(document);
  const body: HTMLElement = document.body;
  invariant(body);
  const el: HTMLElement = document.createElement('div');
  el.className = 'rfd-portal';
  body.appendChild(el);
  return el;
});

export default class Task extends Component<Props> {
  render(): ReactElement {
    const task: TaskType = this.props.task;
    const index: number = this.props.index;

    return (
      <BlurContext.Consumer>
        {(blur: number) => (
          <Draggable draggableId={task.id} index={index}>
            {(
              provided: DraggableProvided,
              snapshot: DraggableStateSnapshot,
            ): ReactElement => {
              const child: ReactElement = (
                <Container
                  ref={provided.innerRef}
                  isDragging={snapshot.isDragging}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  blur={blur}
                >
                  {this.props.task.content}
                </Container>
              );

              if (!snapshot.isDragging) {
                return child;
              }

              return ReactDOM.createPortal(child, getPortal());
            }}
          </Draggable>
        )}
      </BlurContext.Consumer>
    );
  }
}
