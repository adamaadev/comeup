import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const itemsPerPage = 20;

  // Récupération des colonnes sauvegardées dans le localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('columns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      // Colonnes par défaut si aucune sauvegarde
      setColumns(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
    }
  }, []);

  // Sauvegarde des colonnes réorganisées dans le localStorage
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);

    setColumns(updatedColumns);
    // Enregistrer dans le localStorage
    localStorage.setItem('columns', JSON.stringify(updatedColumns));
  };

  // Autres fonctions comme le fetch des données
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation); // Tri décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  // Filtrage des données
  useEffect(() => {
    const applyFilters = () => {
      return infos.filter(info => {
        const matchesQuery = info.symbol.toLowerCase().includes(query.toLowerCase());
        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true; // Pas de filtre sélectionné
          // Autres logiques de filtre
        });
        return matchesQuery && matchesFilters;
      });
    };
  
    const filtered = applyFilters();
    const sortedFiltered = filtered.sort((a, b) => b.Capitalisation - a.Capitalisation);
    setFilteredInfos(sortedFiltered);
  }, [filters, query, infos]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInfos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInfos.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Screener Quality</h2>
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher par nom ou symbole"
            value={query}
            onChange={handleQueryChange}
          />
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Filtres
          </Button>
        </div>
      </div>
      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="horizontal">
          {(provided) => (
            <tr ref={provided.innerRef} {...provided.droppableProps}>
              {columns.map((column, index) => (
                <Draggable key={column} draggableId={column} index={index}>
                  {(provided) => (
                    <th
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <FaGripVertical /> {column}
                    </th>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tr>
          )}
        </Droppable>
      </DragDropContext>
      {/* Affichage des items paginés */}
      <table>
        <thead>
          <tr>{columns.map((col, idx) => <th key={idx}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {currentItems.map((item, idx) => (
            <tr key={idx}>
              {columns.map((col) => <td key={col}>{item[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div>
        <Button onClick={handlePrevPage}>Précédent</Button>
        <Button onClick={handleNextPage}>Suivant</Button>
      </div>
    </section>
  );
}
