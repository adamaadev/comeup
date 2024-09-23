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
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation', 'eligiblePea', 'verseDividende']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);

    setColumns(updatedColumns);
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
    'eligiblePea': 'Éligible PEA',
    'verseDividende': 'Verse Dividende'
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
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
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
        const matchesQuery =
          info.symbol.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true; // Pas de filtre sélectionné

          if (filterType === 'eligiblePea') {
            return (info[filterType] ? 'Oui' : 'Non') === selectedOption;
          }

          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
            const value = parseFloat(info[filterType]);
            if (isNaN(value)) return true; // Si la valeur n'est pas un nombre, ignorer les filtres min/max
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
    return [];
  };

  const currentItems = filteredInfos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredInfos.length / itemsPerPage);

  return (
    <div>
      <h1>Watchlist</h1>
      <input type="text" placeholder="Rechercher..." value={query} onChange={handleQueryChange} />
      <div>
        {filters.map((filter, index) => (
          <div key={index} className="filter-row">
            <select
              value={filter.filterType}
              onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
            >
              <option value="">Sélectionner un critère</option>
              {getAvailableRatioOptions(index).map((option) => (
                <option key={option} value={option}>
                  {ratioNames[option] || option}
                </option>
              ))}
            </select>
            {filter.filterType && (
              <>
                {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) ? (
                  <>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filter.min}
                      onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filter.max}
                      onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                    />
                  </>
                ) : (
                  <select
                    value={filter.selectedOption}
                    onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                  >
                    <option value="">Sélectionner une option</option>
                    {getFilterOptions(filter.filterType).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
            <button onClick={() => removeFilter(index)}>Supprimer</button>
          </div>
        ))}
        <button onClick={addFilter}>Ajouter un filtre</button>
      </div>
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <table
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="data-table"
              >
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>
                        {ratioNames[column] || column}
                        {index !== 0 && (
                          <span className="drag-handle">
                            <FaGripVertical />
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item.id}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column === 'eligiblePea' ? (
                            item[column] ? <FaCheck color="green" /> : <FaTimes color="red" />
                          ) : column === 'verseDividende' ? (
                            item[column] ? <FaCheck color="green" /> : <FaTimes color="red" />
                          ) : (
                            item[column] || '-'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Précédent
        </Button>
        <span>{currentPage} / {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Suivant
        </Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Column Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Configuration logic for columns */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => console.log('Save changes')}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
