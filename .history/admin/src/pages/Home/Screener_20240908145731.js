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
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);

    setColumns(updatedColumns);
    // Enregistrer l'ordre des colonnes dans le localStorage
    localStorage.setItem('draggedColumns', JSON.stringify(updatedColumns));
  };

  useEffect(() => {
    const savedColumns = localStorage.getItem('draggedColumns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  const ratioNames = {
    'exchangeShortName': 'exchange',
    'pays': 'Pays',
    'secteur': 'Secteur',
    'industrie': 'Industrie',
    'buyback_yield': 'Buyback yield',
    'croissance_CA_1_an': 'CA 1 an',
    'croissance_CA_5_ans': 'CA 5 ans',
    'croissance_CA_10_ans': 'CA 10 ans',
    'fcf_1_year': 'FCF 1 an',
    'fcf_5_years': 'FCF 5 ans',
    'fcf_10_years': 'FCF 10 ans',
    'fcf_margin_one_year': 'FCF Margin 1 an',
    'fcf_margin_five_year': 'FCF Margin 5 ans',
    'roce': 'ROCE 1 an',
    'roce_5_year_avg': 'ROCE Moyenne 5 ans',
    'croissance_resultat_net_1_an': 'Résultat Net 1 an',
    'croissance_resultat_net_5_ans': 'Résultat Net 5 ans',
    'piotroski_score': 'Piotroski-Score',
    'ratio_capex_revenu_net': 'Ratio CAPEX/Revenu Net',
    'rachat_net_moyen': 'Rachat Net Moyen',
    'croissance_annualisee': 'Croissance Annualisée',
    'croissance_moyenne': 'Croissance Moyenne',
    'debt_equity': 'Debt-Equity',
    'ratio_payout': 'Payout-Ratio',
    'performance': 'Performance 5 ans',
    'nbreannee': 'Nombre d\'années',
  };

  const handleCloseModal = () => setShowModal(false);

  const getAvailableRatioOptions = (currentFilterIndex) => {
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);

    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation);
        setInfos(sortedData);
        setFilteredInfos(sortedData);
      });
  }, []);

  useEffect(() => {
    const initialColumns = ['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation', 'exchangeShortName'];
    const newColumns = [
      ...initialColumns.filter(col => col !== 'exchangeShortName'),
      ...filters
        .map(f => f.filterType)
        .filter(f => f && !initialColumns.includes(f))
    ];
    setColumns(newColumns);
  }, [filters]);

  useEffect(() => {
    const applyFilters = () => {
      return infos.filter(info => {
        const matchesQuery = info.symbol.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true;

          if (filterType === 'eligiblePea') {
            return (info[filterType] ? 'Oui' : 'Non') === selectedOption;
          }

          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
            const value = parseFloat(info[filterType]);
            if (isNaN(value)) return true;
            if (min && value < parseFloat(min)) return false;
            if (max && value > parseFloat(max)) return false;
            return true;
          }

          if (!selectedOption) return true;

          return info[filterType] === selectedOption;
        });

        return matchesQuery && matchesFilters;
      });
    };

    const filtered = applyFilters();
    const sortedFiltered = filtered.sort((a, b) => b.Capitalisation - a.Capitalisation);
    setFilteredInfos(sortedFiltered);
  }, [filters, query, infos]);

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    setSecondSelectChanged(true);
  };

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery === '') {
      setFilteredInfos(infos);
    } else {
      setSecondSelectChanged(true);
    }
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

    if (['selectedOption', 'min', 'max'].includes(field)) {
      setSecondSelectChanged(true);
    }

    setFilters(newFilters);
  };

  const addFilter = () => {
    if (filters.length < 2) {
      setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
    }
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
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    {columns.map((col, i) => (
                      <td key={i}>{col === 'Capitalisation' ? `${formatNumber(item[col])}B` : item[col]}</td>
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
                  {getAvailableRatioOptions(index).map((option) => (
                    <option key={option} value={option}>{ratioNames[option] || option}</option>
                  ))}
                </select>
              </div>

              {filter.filterType && !['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) && (
                <div className="form-group">
                  <label>Option</label>
                  <select
                    className="form-control"
                    value={filter.selectedOption}
                    onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                  >
                    <option value="">Choisir une option</option>
                    {getFilterOptions(filter.filterType).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) && (
                <div className="form-group">
                  <label>Min</label>
                  <input
                    type="number"
                    className="form-control"
                    value={filter.min}
                    onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                  />
                  <label>Max</label>
                  <input
                    type="number"
                    className="form-control"
                    value={filter.max}
                    onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                  />
                </div>
              )}

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
          <Button variant="primary" onClick={addFilter} disabled={filters.length >= 2}>
            Ajouter un filtre
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
