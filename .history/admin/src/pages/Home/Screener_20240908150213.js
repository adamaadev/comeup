import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';

export default function Screener() {
  const [columns, setColumns] = useState([
    'Nom', 'Pays', 'Secteur', 'Symbol', 'Capitalisation'
  ]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Restaurer l'ordre des colonnes depuis localStorage lors du montage du composant
  useEffect(() => {
    const savedOrder = localStorage.getItem('columnOrder');
    if (savedOrder) {
      setColumns(JSON.parse(savedOrder));
    }
  }, []);

  // Sauvegarder l'ordre des colonnes dans localStorage après le drag & drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);

    setColumns(newColumns);
    localStorage.setItem('columnOrder', JSON.stringify(newColumns));
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFilterChange = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [key]: value };
    setFilters(newFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleQueryChange = (e) => setQuery(e.target.value);

  // Exemple de données factices
  const allItems = [
    { id: 1, Nom: 'Company A', Pays: 'France', Secteur: 'Tech', Symbol: 'CMA', Capitalisation: 150 },
    { id: 2, Nom: 'Company B', Pays: 'USA', Secteur: 'Health', Symbol: 'CMB', Capitalisation: 250 },
    // ...
  ];

  const filteredItems = allItems.filter((item) => item.Nom.toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section>
      <div className="row">
        <div className="col-md-6">
          <h4>Screener</h4>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Rechercher un titre"
              value={query}
              onChange={handleQueryChange}
            />
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Filtrer
            </Button>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <table className="table table-striped" {...provided.droppableProps} ref={provided.innerRef}>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <Draggable key={col} draggableId={col} index={index}>
                      {(provided) => (
                        <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <FaGripVertical /> {col}
                        </th>
                      )}
                    </Draggable>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col}>
                        {col === 'Capitalisation' ? `${item[col]}B` : item[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {provided.placeholder}
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <div className="d-flex justify-content-between mt-3">
        <Button variant="primary" onClick={handlePrevPage} disabled={currentPage === 1}>
          Page précédente
        </Button>
        <Button variant="primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Page suivante
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index} className="filter-group mb-3">
              <div className="form-group">
                <label>Filtre</label>
                <select
                  className="form-control"
                  value={filter.filterType}
                  onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                >
                  <option value="">Choisir un filtre</option>
                  {/* Ajouter des options de filtres */}
                </select>
              </div>

              <Button variant="danger" onClick={() => removeFilter(index)}>
                Supprimer le filtre
              </Button>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={addFilter}>
            Ajouter un filtre
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
