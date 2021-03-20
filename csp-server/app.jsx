// disabling flowtype to keep this example super simple
// It matches
/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from '../src';

// fake data generator
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: getItems(10),
      cspErrors: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    document.addEventListener('securitypolicyviolation', (e) => {
      this.setState((state) => {
        return { cspErrors: [...state.cspErrors, e] };
      });
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      items,
    });
  }

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
