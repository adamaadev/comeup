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
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  const ratioNames = {
    // ... (définition des noms de ratios comme dans votre code initial)
  };

  useEffect(() => {
    // Charger l'ordre des colonnes depuis localStorage ou définir les colonnes par défaut
    const savedColumns = JSON.parse(localStorage.getItem('columnOrder'));
    const defaultColumns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap', 'exchangeShortName'];
    setColumns(savedColumns || defaultColumns.filter(col => col !== 'exchangeShortName'));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      return infos.filter(info => {
        const matchesQuery =
          info.Name.toLowerCase().includes(query.toLowerCase()) ||
          info.symbol.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true;

          if (filterType === 'eligiblePea') return (info[filterType] ? 'Oui' : 'Non') === selectedOption;

          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
            const value = parseFloat(info[filterType]);
            if (isNaN(value)) return true; // Si la valeur n'est pas un nombre, ignore les filtres min/max
            if (min && value < parseFloat(min)) return false;
            if (max && value > parseFloat(max)) return false;
            return true;
          }

          return info[filterType] === selectedOption;
        });
        return matchesQuery && matchesFilters;
      });
    };

    if (secondSelectChanged) {
      const filtered = applyFilters();
      const sortedFiltered = filtered.sort((a, b) => b.marketcap - a.marketcap);
      setFilteredInfos(sortedFiltered);
      setSecondSelectChanged(false);
    } else {
      setFilteredInfos(prevFilteredInfos => prevFilteredInfos.filter(info =>
        info.Name.toLowerCase().includes(query.toLowerCase()) ||
        info.symbol.toLowerCase().includes(query.toLowerCase())
      ));
    }
  }, [filters, secondSelectChanged, query, infos]);

  useEffect(() => {
    const initialColumns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap', 'exchangeShortName'];
    const newColumns = [
      ...initialColumns.filter(col => col !== 'exchangeShortName'),
      ...filters
        .map(f => f.filterType)
        .filter(f => f && !initialColumns.includes(f))
    ];
    setColumns(newColumns);
  }, [filters]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);

    setColumns(updatedColumns);
    localStorage.setItem('columnOrder', JSON.stringify(updatedColumns)); // Enregistrer l'ordre des colonnes
  };

  const handleCloseModal = () => setShowModal(false);
  const getAvailableRatioOptions = (currentFilterIndex) => {
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);

    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;

    if (field === 'filterType') {
      newFilters[index].selectedOption = '';
      newFilters[index].min = '';
      newFilters[index].max = '';
      setSecondSelectChanged(false);
    }

    if (field === 'selectedOption' || field === 'min' || field === 'max') {
      setSecondSelectChanged(true);
    }

    setFilters(newFilters);
  };

  const addFilter = () => {
    if (filters.length < 2) {
      setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
    }
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const getFilterOptions = (filterType) => {
    if (!filterType) return [];
    if (filterType === 'eligiblePea') return ['Oui', 'Non'];
    if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
      return [];
    }
    return [...new Set(infos.map(info => info[filterType]))];
  };

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

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Type de filtre</label>
                <select
                  className="form-select"
                  value={filter.filterType}
                  onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                >
                  <option value="">Choisir un type de filtre</option>
                  {Object.keys(ratioNames).map(ratio => (
                    <option key={ratio} value={ratio}>{ratioNames[ratio]}</option>
                  ))}
                </select>
              </div>
              {filter.filterType && (
                <>
                  <div className="mb-2">
                    <label className="form-label">Option</label>
                    <select
                      className="form-select"
                      value={filter.selectedOption}
                      onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                    >
                      <option value="">Choisir une option</option>
                      {getFilterOptions(filter.filterType).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Min</label>
                    <input
                      type="number"
                      className="form-control"
                      value={filter.min}
                      onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Max</label>
                    <input
                      type="number"
                      className="form-control"
                      value={filter.max}
                      onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                    />
                  </div>
                </>
              )}
              <Button variant="danger" onClick={() => removeFilter(index)}>Supprimer</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addFilter}>Ajouter un filtre</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
        </Modal.Footer>
      </Modal>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <table className="table table-striped" ref={provided.innerRef} {...provided.droppableProps}>
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map((column, index) => (
                    <Draggable key={column} draggableId={column} index={index}>
                      {(provided) => (
                        <th
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <FaGripVertical />
                          {column}
                        </th>
                      )}
                    </Draggable>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.symbol}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    {columns.map(col => (
                      <td key={col}>
                        {col === 'marketcap' ? formatNumber(item[col]) : item[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <Button className="page-link" onClick={handlePrevPage}>Précédent</Button>
          </li>
          <li className="page-item">
            <span className="page-link">
              Page {currentPage} sur {totalPages}
            </span>
          </li>
          <li className="page-item">
            <Button className="page-link" onClick={handleNextPage}>Suivant</Button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
