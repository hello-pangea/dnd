# Combining

> 👶 This feature is still quite young. We wanted to get it out there for people to play with

`@hello-pangea/dnd` supports the combining of `<Draggable />`s 🤩

![combining](https://user-images.githubusercontent.com/2182637/48045145-318dc300-e1e3-11e8-83bd-22c9bd44c442.gif)

> 🌲 If you are looking to build a tree view, we have built one already! [@atlaskit/tree](https://atlaskit.atlassian.com/packages/confluence/tree)

## Setup

In order to enable combining you need to set `isCombineEnabled` to `true` on a `<Droppable />` and you are good to go!

```js
<Droppable droppableId="droppable" isCombineEnabled>
  ...
</Droppable>
```

## Behaviour

When `isCombineEnabled` is set on a list _any_ item in the list can be combine with. You can toggle `isCombineEnabled` during a drag. `@hello-pangea/dnd` works hard to ensure that users are able to combine and reorder within the same list in a way that feels intuitive and natural.

## Current limitations

- No granular control over which items can be combined with within the list. We could move to the `isCombineEnabled` prop from a `<Droppable />` to a `<Draggable />` to allow this sort of customisation. However, in order to ship this huge feature we went a bit simplier to start with
- A list must be reorderable to also have items that can be combined with. It is not possible for a list to be 'combine only' at this stage

## `<Draggable />` > `DraggableStateSnapshot`

```diff
interface DraggableStateSnapshot {
  isDragging: boolean;
  isDropAnimating: boolean;
  isClone: boolean;
  dropAnimation: DropAnimation | null;
  draggingOver: DroppableId | null;
+ combineWith: DraggableId | null;
+ combineTargetFor: DraggableId | null;
  mode: MovementMode | null;
}
```

If you are dragging a `<Draggable />` over another `<Draggable />` in combine mode then the id of the `<Draggable />` being dragged over will be populated in `combineWith`

If a `<Draggable />` is being dragged over in combine mode then the id of the `<Draggable />` being dragged will be populated in `combineTargetFor`

## `<DragDropContext />` > `Responders`

`onDragUpdate` and `onDragEnd` will be updated with any changes to a `combine`

> See our [type guide](/docs/guides/types.md) for more details

## Persisting a `combine`

A `combine` result might signify different operations depending on your problem domain.

When combining, a simple operation is to just remove the item that was dragging

```ts
function onDragEnd(result) {
  // combining item
  if (result.combine) {
    // super simple: just removing the dragging item
    const items: Quote[] = [...this.state.items];
    items.splice(result.source.index, 1);
    setState({ items });
    return;
  }
}
```

## Drop animation

One of the goals of `@hello-pangea/dnd` is to create a drag and drop experience that feels physical. This is a bit tricky to achieve in a generic way when it comes to combining two things.

What we have gone for out of the box in the following animation:

- move the dragging item onto the center of the item being grouped with
- fade the opacity of the dragging item down to `0`
- scale the dragging item down

This animation attempts to communicate one item _moving into_ another item in a fairly generic way.

![combining](https://user-images.githubusercontent.com/2182637/48045145-318dc300-e1e3-11e8-83bd-22c9bd44c442.gif)

You are welcome to customise this animation using the information found in our [drop animation guide](/docs/guides/drop-animation.md)

[← Back to documentation](/README.md#documentation-)
