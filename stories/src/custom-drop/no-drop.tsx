import React, { CSSProperties, ReactElement } from 'react';
import styled from '@emotion/styled';
import { grid } from '../constants';
import reorder from '../reorder';
import { DragDropContext, Draggable, Droppable } from '../../../src';

import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
  DropResult,
} from '../../../src';

interface Task {
  id: string;
  content: string;
}

interface TaskItemProps {
  task: Task;
  index: number;
}

const Canvas = styled.div`
  padding: ${grid}px;
  background: lightgrey;
  margin-bottom: ${grid}px;
  border-radius: 3px;
`;

const getStyle = (
  style: DraggingStyle | NotDraggingStyle | undefined,
  snapshot: DraggableStateSnapshot,
): CSSProperties => {
  if (!snapshot.isDropAnimating) {
    return style || {};
  }

  return {
    ...style,
    transitionDuration: `0.001s`,
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

interface State {
  tasks: Task[];
}

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
