import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';

export default function Screener() {
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketCap']);

  // Load columns from localStorage when component mounts
  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('columns'));
    if (savedColumns) {
      setColumns(savedColumns);
    }
  }, []);

  // Save columns to localStorage after drag-and-drop completes
  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);

    setColumns(updatedColumns);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ display: 'flex', gap: '10px' }}
            >
              {columns.map((col, idx) => (
                <Draggable key={col} draggableId={col} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <FaGripVertical style={{ marginRight: '8px' }} />
                      {col}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
