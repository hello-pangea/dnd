import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '../src';

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = <TList extends unknown[]>(
  list: TList,
  startIndex: number,
  endIndex: number,
): TList => {
  const result = Array.from(list) as TList;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface AppProps {
  nonce?: string;
}

interface Item {
  id: string;
  content: string;
}

interface AppState {
  items: Item[];
  cspErrors: SecurityPolicyViolationEvent[];
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      items: getItems(10),
      cspErrors: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    document.addEventListener(
      'securitypolicyviolation',
      this.onSecurityPolicyViolation,
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'securitypolicyviolation',
      this.onSecurityPolicyViolation,
    );
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index,
    );

    this.setState((state) => ({
      ...state,
      items,
    }));
  }

  onSecurityPolicyViolation = (e: SecurityPolicyViolationEvent) => {
    // Cypress is injecting css using style tag
    // which cause SecurityPolicyViolationEvent.
    // Here we are not counting these error in
    // the count.
    if (e.sourceFile.match(/cypress/)) {
      return;
    }

    this.setState((state) => {
      return { ...state, cspErrors: [...state.cspErrors, e] };
    });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd} nonce={this.props.nonce}>
        <h1>
          Content-Security-Policy error count:{' '}
          <b id="cspErrors">{this.state.cspErrors.length}</b>
        </h1>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div ref={droppableProvided.innerRef}>
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
