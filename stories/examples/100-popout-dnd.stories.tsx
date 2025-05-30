import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
  DraggableProvided,
  DroppableProvided,
  DropResult,
  SensorAPI,
  TryGetLockOptions,
  FluidDragActions,
} from '@hello-pangea/dnd';

// Helper to create some items
const getItems = (count: number, offset = 0): Item[] =>
  Array.from({ length: count }, (v, k) => k + offset).map(k => ({
    id: `item-${k}-${Date.now()}`, // Unique IDs for re-renders
    content: `Item ${k}`,
  }));

// Helper function to reorder a list
const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface Item {
  id: string;
  content: string;
}

// Define an augmented options type for story, until library types are patched
interface PatchedTryGetLockOptions extends TryGetLockOptions {
  targetDocument?: Document;
}

interface DndListComponentProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
  windowContext?: Window;
}

// Define a custom sensor that uses windowContext
const useCustomSensorWithWindowContext = (api: SensorAPI, windowCtx?: Window) => {
  const dragActionsRef = useRef<FluidDragActions | null>(null);
  const winRef = useRef(windowCtx || window.self);

  useEffect(() => {
    winRef.current = windowCtx || window.self;
  }, [windowCtx]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (dragActionsRef.current) {
      dragActionsRef.current.move({ x: event.clientX, y: event.clientY });
    }
  }, []);

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      winRef.current.document.removeEventListener('mousemove', handleMouseMove as EventListener);
      winRef.current.document.removeEventListener('mouseup', handleMouseUp as EventListener);

      if (dragActionsRef.current) {
        dragActionsRef.current.drop();
        dragActionsRef.current = null;
      }
    },
    [handleMouseMove] 
  );

  const startDrag = useCallback(
    (event: MouseEvent) => {
      if (dragActionsRef.current) {
        return;
      }

      const target = event.target as HTMLElement;
      let draggableId: string | null = null;
      let currentElement: HTMLElement | null = target;
      while(currentElement && !draggableId) {
        draggableId = currentElement.getAttribute('data-rfd-draggable-id');
        if (!draggableId) {
            draggableId = currentElement.getAttribute('data-rfd-drag-handle-draggable-id');
        }
        currentElement = currentElement.parentElement;
      }
      if(!draggableId && target.hasAttribute('data-rfd-draggable-id')) {
        draggableId = target.getAttribute('data-rfd-draggable-id');
      }

      if (!draggableId) return;

      const docForDnd = winRef.current.document;

      const preDrag = api.tryGetLock(draggableId, undefined, {
        sourceEvent: event,
        targetDocument: docForDnd,
      } as PatchedTryGetLockOptions);

      if (!preDrag) {
        return;
      }
      
      event.preventDefault();

      dragActionsRef.current = preDrag.fluidLift({ x: event.clientX, y: event.clientY });
      winRef.current.document.addEventListener('mousemove', handleMouseMove as EventListener);
      winRef.current.document.addEventListener('mouseup', handleMouseUp as EventListener);
    },
    [api, handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    const currentWin = winRef.current;
    currentWin.document.addEventListener('mousedown', startDrag as EventListener);

    return () => {
      currentWin.document.removeEventListener('mousedown', startDrag as EventListener);
      currentWin.document.removeEventListener('mousemove', handleMouseMove as EventListener);
      currentWin.document.removeEventListener('mouseup', handleMouseUp as EventListener);
      
      if (dragActionsRef.current) {
        if (typeof dragActionsRef.current.cancel === 'function') {
            dragActionsRef.current.cancel();
        }
        dragActionsRef.current = null;
      }
    };
  }, [startDrag, handleMouseMove, handleMouseUp]);
};

const DndListComponent: React.FC<DndListComponentProps> = ({
  items,
  onItemsChange,
  windowContext, // Receive windowContext
}) => {
  const onDragEnd: OnDragEndResponder = (result: DropResult) => {
    if (!result.destination) {
      // If drag was cancelled or dropped outside, activeDrag should already be null
      // or handled by the sensor's mouseup.
      return;
    }
    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    onItemsChange(newItems);
  };
  
  // Memoize the sensor array to prevent re-creation on every render if not necessary
  const sensors = React.useMemo(() => {
    // This function will be called by DragDropContext to get the SensorAPI
    return [(api: SensorAPI) => useCustomSensorWithWindowContext(api, windowContext)];
  }, [windowContext]);

  return (
    // Pass the custom sensor to DragDropContext
    <DragDropContext onDragEnd={onDragEnd} sensors={sensors}  targetWindow={windowContext} >
      <Droppable droppableId="droppable-list-popout-story">
        {(provided: DroppableProvided) => (
          // Add data-rfd-draggable-id to the droppable div for the sensor to find (if needed, or adjust sensor logic)
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ padding: 8, width: 250, background: '#ADD8E6', border: '1px solid blue', minHeight: '100px' }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(providedDraggable: DraggableProvided, snapshot) => (
                  // Ensure this div has the necessary attributes for the sensor to pick up draggableId
                  // The library itself adds data-rfd-draggable-id to this element via providedDraggable.draggableProps
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps} // This applies data-rfd-draggable-id and context-id
                    {...providedDraggable.dragHandleProps} // This applies data-rfd-drag-handle-draggable-id and context-id
                    style={{
                      userSelect: 'none',
                      padding: '8px 16px',
                      margin: '0 0 8px 0',
                      backgroundColor: snapshot.isDragging ? '#4CAF50' : '#2196F3',
                      color: 'white',
                      border: '1px solid #1976D2',
                      ...providedDraggable.draggableProps.style,
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// New component for the controls (button)
interface PopoutControlsProps {
  onTogglePopout: () => void;
  isPopoutOpen: boolean;
  popoutWindow?: Window | null;
}

const PopoutControls: React.FC<PopoutControlsProps> = ({ onTogglePopout, isPopoutOpen, popoutWindow }) => {
  // If in popout, ensure button clicks are handled by the main window's logic
  // This simple example just calls onTogglePopout directly.
  // For more complex interactions, you might need window.opener.postMessage or similar.
  const handleClick = () => {
    onTogglePopout();
  };

  return (
    <button 
      onClick={handleClick}
      style={{ padding: '10px 15px', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' }}
    >
      {isPopoutOpen ? 'Move to Main Window' : 'Move to Popout Window'}
    </button>
  );
};

const PopoutDndStoryComponent = () => {
  const [items, setItems] = useState<Item[]>(() => getItems(3));
  const [popoutTarget, setPopoutTarget] = useState<HTMLDivElement | null>(null);
  const popoutWindowRef = useRef<Window | null>(null);
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);

  // Encapsulate popout logic into a single toggle function for the controls
  const handleTogglePopout = useCallback(() => {
    if (isPopoutOpen) {
      // Closing popout
      if (popoutWindowRef.current && !popoutWindowRef.current.closed) {
        popoutWindowRef.current.close(); // This will trigger beforeunload
      } else {
        // If window already closed by user, just update state
        setIsPopoutOpen(false);
        setPopoutTarget(null);
        popoutWindowRef.current = null;
      }
    } else {
      // Opening popout
      if (popoutWindowRef.current && !popoutWindowRef.current.closed) {
          popoutWindowRef.current.focus();
          return;
      }
      const newWindow = window.open('', 'PopoutDndWindowStory', 'width=600,height=400,left=200,top=200');
      if (newWindow) {
        popoutWindowRef.current = newWindow;
        newWindow.document.title = 'D&D Popout Story';
        const targetDiv = newWindow.document.createElement('div');
        targetDiv.id = 'popout-dnd-root-story';
        newWindow.document.body.style.margin = '0';
        newWindow.document.body.style.padding = '10px';
        newWindow.document.body.style.backgroundColor = '#f0f0f0';
        newWindow.document.body.appendChild(targetDiv);

        const styleSheets = Array.from(window.document.styleSheets);
        styleSheets.forEach(sheet => {
          try {
            if (sheet.cssRules) {
              const newStyleEl = newWindow.document.createElement('style');
              Array.from(sheet.cssRules).forEach(rule => {
                newStyleEl.appendChild(newWindow.document.createTextNode(rule.cssText));
              });
              newWindow.document.head.appendChild(newStyleEl);
            } else if (sheet.href) {
              const newLinkEl = newWindow.document.createElement('link');
              newLinkEl.rel = 'stylesheet';
              newLinkEl.href = sheet.href;
              newWindow.document.head.appendChild(newLinkEl);
            }
          } catch (e) {
            console.warn('Could not copy stylesheet to popout:', e);
          }
        });
        
        setPopoutTarget(targetDiv);
        setIsPopoutOpen(true);

        newWindow.addEventListener('beforeunload', () => {
          setIsPopoutOpen(false);
          setPopoutTarget(null);
          popoutWindowRef.current = null;
        });
      }
    }
  // Ensure dependencies are correct, especially for `isPopoutOpen`
  }, [isPopoutOpen]);

  useEffect(() => {
    const currentPopoutWindow = popoutWindowRef.current;
    return () => {
      if (currentPopoutWindow && !currentPopoutWindow.closed) {
        currentPopoutWindow.close();
      }
    };
  }, []);

  // Content to be displayed either in main window or popout
  const contentToDisplay = (
    <div style={{border: '1px solid green', padding: '10px'}}>
      <PopoutControls 
        onTogglePopout={handleTogglePopout} 
        isPopoutOpen={isPopoutOpen} 
        popoutWindow={popoutWindowRef.current} 
      />
      <DndListComponent
        items={items}
        onItemsChange={setItems}
        windowContext={isPopoutOpen && popoutWindowRef.current ? popoutWindowRef.current : window}
      />
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {!isPopoutOpen && contentToDisplay} 
      {isPopoutOpen && popoutTarget && ReactDOM.createPortal(contentToDisplay, popoutTarget)}
    </div>
  );
};

export const ListInPopupWindow = PopoutDndStoryComponent;

export default {
  title: 'Examples/List in Popup Window (React Portal)',
  component: PopoutDndStoryComponent,
}; 