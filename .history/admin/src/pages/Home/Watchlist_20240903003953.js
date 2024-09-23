import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';

export default function Watchlist() {
  const type = "admin";
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [columnOrder, setColumnOrder] = useState([
    { id: 'logo', label: 'Nom' },
    { id: 'pays', label: 'Pays' },
    { id: 'secteur', label: 'Secteur' },
    { id: 'industrie', label: 'Industrie' },
    { id: 'marketcap', label: 'Capitalisation (MDS)' },
    { id: 'pea', label: 'PEA' }
  ]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id));
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/watchlist', { id, type })
        .then(res => {
          setInfos(res.data);
        });
    }
  }, [id]);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const filteredInfos = infos.filter(info =>
    info.Name.toLowerCase().includes(query.toLowerCase()) ||
    info.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(infos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setInfos(items);

    const newOrder = items.map(item => item.symbol);
    localStorage.setItem('watchlistOrder', JSON.stringify(newOrder));
  };

  const handleColumnDragEnd = (result) => {
    if (!result.destination) return;

    const columns = Array.from(columnOrder);
    const [reorderedColumn] = columns.splice(result.source.index, 1);
    columns.splice(result.destination.index, 0, reorderedColumn);

    setColumnOrder(columns);
  };

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Ma watchlist</h2>
        </div>
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Rechercher sur la liste" 
            value={query}
            onChange={handleQueryChange}
          />
        </div>
      </div>
      <div className="table-responsive">
        {filteredInfos.length > 0 ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="watchlist" direction="horizontal" type="column">
              {(provided) => (
                <table className="table table-striped" {...provided.droppableProps} ref={provided.innerRef}>
                  <thead>
                    <tr>
                      <th></th> {/* Colonne pour l'icône */}
                      <DragDropContext onDragEnd={handleColumnDragEnd}>
                        <Droppable droppableId="droppable-columns" direction="horizontal" type="column">
                          {(provided) => (
                            <tr {...provided.droppableProps} ref={provided.innerRef}>
                              {columnOrder.map((column, index) => (
                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                  {(provided) => (
                                    <th 
                                      ref={provided.innerRef} 
                                      {...provided.draggableProps} 
                                      {...provided.dragHandleProps}
                                    >
                                      <FaGripVertical className="mr-2" />
                                      {column.label}
                                    </th>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </tr>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </tr>
                  </thead>
     
