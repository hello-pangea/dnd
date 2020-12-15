# Tables

| Benefits of using `<table>`                      | Provider                 |
| ------------------------------------------------ | ------------------------ |
| Clean way of displaying tabular data             | Browser                  |
| Great browser support                            | Browser                  |
| Can copy paste the table into other applications | Browser                  |
| Can reorder items in the table!                  | `react-forked-dnd` 😎 |

`react-forked-dnd` requires no additional wrapping elements to create `<Draggable />` and `<Droppable />` components. Therefore it is possible to have a `<table>` that has valid HTML as well as supporting drag and drop.

> We have not found a way to achieve semantic reordering of table columns at this stage. This is because there is no one element that represents a table column - rather, a column is a result of cell placements within repeating rows. As such as cannot wrap a `<Draggable />` around a 'column' in order to make it draggable. PR's to this guide are welcome if you find a working approach!

## Strategies

There are two strategies you can use when reordering tables.

1.  Fixed layouts (faster and simpler)
2.  Dimension locking (slower but more robust)

### Strategy 1: fixed layouts

In order to use this strategy the widths of your columns need to be fixed - that is, they will not change depending on what content is placed in the cells. This can be achieved with either a `table-layout: fixed` or `table-layout: auto` as long as you manually set the width of the cells (eg `50%`).

The only thing you need to do is set `display: table` on a `<Draggable />` row while it is dragging.

[See example code here](https://react-forked-dnd.netlify.com/?selectedKind=Tables&selectedStory=with%20fixed%20width%20columns&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel)

Some users have experienced issues using the `table-layout` and `display: table` approach. Specifically, that approach of fixed layouts doesn't keep the styling once an element is being dragged. An alternative is to not set `table-layout` or `display: table` when `<Draggable />` is dragging, but rather just set the `width` of each `<td>` permanently. This avoids the need to use any event responders. E.g. in the `<Draggable />`, set each `<td>` to `width: 100px` with inline styling or css. This approach can be found in the [Code Sandbox here](https://codesandbox.io/s/vertical-list-s9rx5?fontsize=14&hidenavigation=1&theme=dark)

### Strategy 2: dimension locking

This strategy will work with columns that have automatic column widths based on content. It will also work with fixed layouts. **It is a more robust strategy than the first, but it is also less performant.**

When we apply `position: fixed` to the dragging item it removes it from the automatic column width calculations that a table uses. So before a drag starts we _lock_ all of the cell widths using inline styles to prevent the column dimensions from changing when a drag starts. You can achieve this with the [`onBeforeDragStart` responder](/docs/guides/responders.md).

This has poor performance characteristics at scale as it requires:

1.  Calling `render()` on every row
2.  Reading the DOM (`window.getComputedStyles`) on every row

For tables with less than 50 rows this should approach be fine!

[See example code here](https://react-forked-dnd.netlify.com/?selectedKind=Tables&selectedStory=with%20dimension%20locking&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel)

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

- [With our cloning API](https://react-forked-dnd.netlify.com/?path=/story/tables--with-clone)
- [With your own portal](https://react-forked-dnd.netlify.com/?path=/story/tables--with-portal)

You're welcome!

[← Back to documentation](/README.md#documentation-)
