import React, { CSSProperties, ReactElement } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { grid } from '../constants';
import reorder from '../reorder';
import { DragDropContext, Draggable, Droppable } from '../../../src';

import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
  DropAnimation,
  DropResult,
} from '../../../src';

type Task = {
  id: string;
  content: string;
};

type TaskItemProps = {
  task: Task;
  index: number;
};

interface CanvasProps {
  isDragging: boolean;
}

const Canvas = styled.div<CanvasProps>`
  padding: ${grid}px;
  background: ${(props) => (props.isDragging ? colors.G50 : colors.B50)};
  margin-bottom: ${grid}px;
  border-radius: 3px;
`;

const getStyle = (
  style: DraggingStyle | NotDraggingStyle | undefined,
  snapshot: DraggableStateSnapshot,
): CSSProperties => {
  const dropping: DropAnimation | undefined | null = snapshot.dropAnimation;
  if (!dropping) {
    return style || {};
  }
  const { moveTo, curve, duration } = dropping;
  const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
  const rotate = 'rotate(1turn)';
  return {
    ...style,
    transform: `${translate} ${rotate}`,
    // slowing down the drop
    transition: `all ${curve} ${duration + 1}s`,
  };
};

class TaskItem extends React.Component<TaskItemProps> {
  render() {
    const task: Task = this.props.task;
    return (
      <Draggable draggableId={task.id} index={this.props.index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Canvas
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
            style={getStyle(provided.draggableProps.style, snapshot)}
          >
            {task.content}
          </Canvas>
        )}
      </Draggable>
    );
  }
}

const List = styled.div`
  font-size: 16px;
  line-height: 1.5;
  width: 200px;
  margin: ${grid}px;
`;
// eslint-disable-next-line no-restricted-syntax
const initial: Task[] = Array.from(
  { length: 10 },
  (v, k): Task => ({
    id: `task-${k}`,
    content: `Task ${k}`,
  }),
);

type State = {
  tasks: Task[];
};

export default class App extends React.Component<unknown, State> {
  state: State = {
    tasks: initial,
  };

  onDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return;
    }
    this.setState({
      tasks: reorder(
        this.state.tasks,
        result.source.index,
        result.destination.index,
      ),
    });
  };

  render(): ReactElement {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: DroppableProvided) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {this.state.tasks.map((task: Task, index: number) => (
                <TaskItem task={task} index={index} key={task.id} />
              ))}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
