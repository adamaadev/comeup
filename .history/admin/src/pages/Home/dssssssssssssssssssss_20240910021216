import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical, FaCheck, FaTimes } from 'react-icons/fa';

export default function Watchlist() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    // Initialisez les colonnes depuis localStorage ou avec des valeurs par défaut
    const savedColumns = localStorage.getItem('draggedColumns');
    const defaultColumns = ['Name', 'pays', 'secteur', 'industrie', 'Capitalisation'];
    setColumns(savedColumns ? JSON.parse(savedColumns) : defaultColumns);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation);
        setInfos(sortedData);
        setFilteredInfos(sortedData);
      });
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      if (query === '') return infos;

      const filtered = infos.filter(info => {
        const matchesQuery = 
          info.symbol.toLowerCase().includes(query.toLowerCase()) ||
          info.Nom.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true;
          if (filterType === 'eligiblePea') return (info[filterType] ? 'Oui' : 'Non') === selectedOption;
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

      const uniqueResults = new Map();
      filtered.forEach(info => {
        const key = query.toLowerCase();
        if (info.symbol.toLowerCase().includes(key) || info.Nom.toLowerCase().includes(key)) {
          if (!uniqueResults.has(info.Nom)) {
            uniqueResults.set(info.Nom, info);
          } else {
            const existing = uniqueResults.get(info.Nom);
            if (info.symbol.includes('.NE')) {
              uniqueResults.set(info.Nom, info);
            }
          }
        }
      });

      const uniqueFiltered = Array.from(uniqueResults.values());
      const sortedFiltered = uniqueFiltered.sort((a, b) => b.Capitalisation - a.Capitalisation);
      return sortedFiltered;
    };

    const filteredInfos = applyFilters();
    setFilteredInfos(filteredInfos);
  }, [filters, query, infos]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);

    setColumns(updatedColumns);
    localStorage.setItem('draggedColumns', JSON.stringify(updatedColumns));
  };

  const handleCloseModal = () => setShowModal(false);

  const getAvailableRatioOptions = (currentFilterIndex) => {
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);

    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };

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
  const currentInfos = filteredInfos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Rechercher..."
        />
      </div>
      <div className="filters">
        {filters.map((filter, index) => (
          <div key={index} className="filter">
            <select
              value={filter.filterType}
              onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
            >
              <option value="">-- Type de filtre --</option>
              {getAvailableRatioOptions(index).map(option => (
                <option key={option} value={option}>{ratioNames[option] || option}</option>
              ))}
            </select>
            <select
              value={filter.selectedOption}
              onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
            >
              <option value="">-- Option --</option>
              {getFilterOptions(filter.filterType).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) && (
              <>
                <input
                  type="number"
                  value={filter.min}
                  onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filter.max}
                  onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                  placeholder="Max"
                />
              </>
            )}
            <button onClick={() => setFilters(filters.filter((_, i) => i !== index))}>Supprimer</button>
          </div>
        ))}
        <button onClick={addFilter}>Ajouter un filtre</button>
      </div>
      <button onClick={() => setShowModal(true)}>Gérer les colonnes</button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Gérer les Colonnes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {columns.map((column, index) => (
                    <Draggable key={column} draggableId={column} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="column-drag"
                        >
                          <FaGripVertical />
                          {ratioNames[column] || column}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
        </Modal.Footer>
      </Modal>
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{ratioNames[column] || column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentInfos.map((info, index) => (
            <tr key={index}>
              {columns.map((column, i) => (
                <td key={i}>{info[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(filteredInfos.length / itemsPerPage)).keys()].map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number + 1)}
            className={currentPage === number + 1 ? 'active' : ''}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </>
  );
}
