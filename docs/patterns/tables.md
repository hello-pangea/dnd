# Tables

| Benefits of using `<table>`                      | Provider               |
| ------------------------------------------------ | ---------------------- |
| Clean way of displaying tabular data             | Browser                |
| Great browser support                            | Browser                |
| Can copy paste the table into other applications | Browser                |
| Can reorder items in the table!                  | `@hello-pangea/dnd` 😎 |

`@hello-pangea/dnd` requires no additional wrapping elements to create `<Draggable />` and `<Droppable />` components. Therefore it is possible to have a `<table>` that has valid HTML as well as supporting drag and drop.

## Reordering Table Columns

Here is a simple example demonstrating how to use drag-and-drop functionality to reorder table columns.

```tsx
import React, { useState } from 'react';
import { DragDropContext, DragStart, DragUpdate, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';

const Table = ({ dataSource, columns: _columns, style, hideHeader }) => {
    const [userColumns, setUserColumns] = useState(_columns.map(c => c.key.toString()));

    const notFoundIsMaxInt = (index: number) => index === -1 ? Number.MAX_SAFE_INTEGER : index;
    const columns = _columns.slice().sort((a, b) => notFoundIsMaxInt(userColumns.indexOf(a.key.toString())) - notFoundIsMaxInt(userColumns.indexOf(b.key.toString())));

    const [draggableId, setDraggableId] = useState<string | undefined>();

    const onDragStart = (result: DragStart) => {
        setDraggableId(result.draggableId);
    }

    const onDragUpdate = (result: DragUpdate) => {
        if (!draggableId || !result.destination) return;

        const fromIndex = columns.findIndex(c => c.key.toString() === draggableId);
        const toIndex = result.destination.index;

        if (fromIndex === -1 || toIndex === -1) return;

        const newColumns = [...userColumns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);

        setUserColumns(newColumns);
    }

    const onDragEnd = (result: DropResult) => {
        setDraggableId(undefined);
    };

    return (
        <table style={style} className="generic-table">
            {!hideHeader && (
                <thead>
                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragUpdate={onDragUpdate}
                    >
                        <Droppable droppableId="droppable-columns" direction="horizontal">
                            {(droppableProvided) => (
                                <tr ref={droppableProvided.innerRef}>
                                    {columns.map((column, index) => (
                                        <Draggable
                                            key={column.key.toString()}
                                            draggableId={column.key.toString()}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <th
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        width: column.width,
                                                        ...(snapshot.isDragging ? provided.draggableProps.style : {}),
                                                        ...(column.thStyle ?? {}),
                                                    }}
                                                >
                                                    {column.title}
                                                </th>
                                            )}
                                        </Draggable>
                                    ))}
                                    {droppableProvided.placeholder}
                                </tr>
                            )}
                        </Droppable>
                    </DragDropContext>
                </thead>
            )}
            <tbody>
                {dataSource.map((record, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map(column => (
                            <td key={column.key.toString()}>{record[column.dataIndex]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
```

### How it works

The column definitions are stored in the `_columns` prop. We then store the order of the columns in the `userColumns` state. When a column is dragged, we update the `userColumns` state to reflect the new order. This causes the table to re-render with the new column order.

### Pros

It is a simple and clean way to reorder columns in a table and provides immediate visual feedback to the user on how the columns will look when dropped.

### Cons

The columns do not move in an animated fashion, snapping to their new position immediately.

## Strategies

There are two strategies you can use when reordering tables.

1.  Fixed layouts (faster and simpler)
2.  Dimension locking (slower but more robust)

### Strategy 1: fixed layouts

In order to use this strategy the widths of your columns need to be fixed - that is, they will not change depending on what content is placed in the cells. This can be achieved with either a `table-layout: fixed` or `table-layout: auto` as long as you manually set the width of the cells (eg `50%`).

The only thing you need to do is set `display: table` on a `<Draggable />` row while it is dragging.

[See example code here](https://dnd.hellopangea.com/?selectedKind=Tables&selectedStory=with%20fixed%20width%20columns&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel)

Some users have experienced issues using the `table-layout` and `display: table` approach. Specifically, that approach of fixed layouts doesn't keep the styling once an element is being dragged. An alternative is to not set `table-layout` or `display: table` when `<Draggable />` is dragging, but rather just set the `width` of each `<td>` permanently. This avoids the need to use any event responders. E.g. in the `<Draggable />`, set each `<td>` to `width: 100px` with inline styling or css. This approach can be found in the [Code Sandbox here](https://codesandbox.io/s/vertical-list-s9rx5?fontsize=14&hidenavigation=1&theme=dark)

### Strategy 2: dimension locking

This strategy will work with columns that have automatic column widths based on content. It will also work with fixed layouts. **It is a more robust strategy than the first, but it is also less performant.**

When we apply `position: fixed` to the dragging item it removes it from the automatic column width calculations that a table uses. So before a drag starts we _lock_ all of the cell widths using inline styles to prevent the column dimensions from changing when a drag starts. You can achieve this with the [`onBeforeDragStart` responder](/docs/guides/responders.md).

This has poor performance characteristics at scale as it requires:

1.  Calling `render()` on every row
2.  Reading the DOM (`window.getComputedStyles`) on every row

For tables with less than 50 rows this should approach be fine!

[See example code here](https://dnd.hellopangea.com/?selectedKind=Tables&selectedStory=with%20dimension%20locking&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel)

## Advanced: reparenting

If you want to use reparenting (cloning or your own portal) in combination with table row reordering then there are few extra steps you need to go through.

First up, have a read of our [reparenting pattern](/docs/guides/reparenting.md) to get familiar with the approach.

It is important to know the timings of mount / unmount actions in React. We have created a [codesandbox.io example](https://codesandbox.io/s/nkl52y1wn0) to show how the mount timings work when moving in and out of a `ReactDOM.createPortal`.

When moving an existing `<tr>` into a `ReactDOM.createPortal` it is important to know that the existing `<tr>` is unmounted and a new `<tr>` is mounted into the portal. Here is the order of those operations:

1.  The old `<tr>` has `componentWillUnmount` called
2.  The new `<tr>` has `componentWillMount` called

In order to preserve the cell dimensions of the cells in the row that we are moving into a `ReactDOM.createPortal` we need to lock its dimensions using inline styles (see strategy #2). Sadly though, the new component does not directly have access to the information about the component that was in the tree before it moved to the portal. So in order to do this we need to obtain the cell dimensions of the `<tr>` when it is unmounting and re-apply it to the new `<tr>` when it mounted in `componentDidMount`.

There is no great way to do this as when `componentDidMount` is called we are not sure if the component is unmouting as the `<tr>` is no longer needed, or if it is unmounting because it is about to move into a portal.

It seems like the only way to get things working is to:

1.  In `componentWillUnmount` of the `<tr>` read the current widths of the cells from the DOM. You then store this value outside of the component so that it can be read by new components that are mounting.
2.  If a component is mounting and `DraggableStateSnapshot > isDragging` is true then you can see if there is a previously recorded width. If there is then you can apply that width.

This gets a little complicated - so we created some examples to show you how this technique works:

- [With our cloning API](https://dnd.hellopangea.com/?path=/story/examples-tables--with-clone)
- [With your own portal](https://dnd.hellopangea.com/?path=/story/examples-tables--with-portal)

You're welcome!

[← Back to documentation](/README.md#documentation-)
