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
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  // Gestion du drag-and-drop des colonnes
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(source.index, 1);
    updatedColumns.splice(destination.index, 0, removed);
    setColumns(updatedColumns);
  };

  const ratioNames = {
    'exchangeShortName': 'exchange',
    'Name': "Nom",
    'pays': 'Pays',
    'secteur': 'Secteur',
    'industrie': 'Industrie',
    'marketcap': 'Capitalisation (MDS)',
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
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData);
      });
  }, []);

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
            if (isNaN(value)) return true;
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

  return (
    <>
      <h1>Screener</h1>
      <div className="filter-container">
        {filters.map((filter, index) => (
          <div key={index} className="filter-row">
            <select
              value={filter.filterType}
              onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
            >
              <option value="">Select Filter</option>
              {getAvailableRatioOptions(index).map(option => (
                <option key={option} value={option}>{ratioNames[option]}</option>
              ))}
            </select>
            {filter.filterType && (
              <>
                <select
                  value={filter.selectedOption}
                  onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                >
                  <option value="">Select Option</option>
                  {getFilterOptions(filter.filterType).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
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
                <button onClick={() => removeFilter(index)}>Remove Filter</button>
              </>
            )}
          </div>
        ))}
        <button onClick={addFilter}>Add Filter</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search..."
        />
      </div>
      <div className="table-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <table
                className="table table-bordered"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <Draggable key={column} draggableId={column} index={index}>
                        {(provided) => (
                          <th
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {ratioNames[column] || column}
                            <FaGripVertical style={{ cursor: 'grab', marginLeft: 8 }} />
                          </th>
                        )}
                      </Draggable>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((info, index) => (
                    <tr key={index}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex}>
                          {info[col] !== undefined ? info[col] : 'N/A'}
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
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { /* Save changes */ }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
