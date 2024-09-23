import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const itemsPerPage = 20;
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);

  // Ratio names mapping
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

  // Handle drag and drop for column ordering
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

  // Filter and apply data
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation);
        setInfos(sortedData);
      });
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      return infos.filter(info => {
        const matchesQuery =
          info.symbol.toLowerCase().includes(query.toLowerCase());

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

    // Update columns based on filters
    const filterTypes = filters.map(f => f.filterType).filter(Boolean);
    const additionalColumns = filterTypes.filter(ft => ['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans'].includes(ft));
    const newColumns = ['Name', 'pays', 'secteur', 'industrie', 'Capitalisation', ...additionalColumns];
    setColumns(prevColumns => [...new Set([...prevColumns, ...newColumns])]);
  }, [filters, query, infos]);

  const handleCloseModal = () => setShowModal(false);

  const getAvailableRatioOptions = (currentFilterIndex) => {
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);

    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };

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
    return [...new Set(infos.map(info => info[filterType]))];
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInfos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      const newPage = direction === 'next' ? prevPage + 1 : prevPage - 1;
      return Math.max(1, newPage);
    });
  };

  return (
    <div className="container">
      <h1 className="my-4">Screener</h1>
      <Form.Group controlId="searchQuery">
        <Form.Label>Search</Form.Label>
        <Form.Control
          type="text"
          placeholder="Search by symbol"
          value={query}
          onChange={handleQueryChange}
        />
      </Form.Group>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Filter
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index} className="mb-3">
              <Form.Group>
                <Form.Label>Filter Type</Form.Label>
                <Form.Control
                  as="select"
                  value={filter.filterType}
                  onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                >
                  <option value="">Select Filter Type</option>
                  {getAvailableRatioOptions(index).map((option, idx) => (
                    <option key={idx} value={option}>{ratioNames[option]}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              {filter.filterType && (
                <>
                  <Form.Group>
                    <Form.Label>Filter Value</Form.Label>
                    <Form.Control
                      as="select"
                      value={filter.selectedOption}
                      onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                    >
                      <option value="">Select Option</option>
                      {getFilterOptions(filter.filterType).map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) && (
                    <>
                      <Form.Group>
                        <Form.Label>Min Value</Form.Label>
                        <Form.Control
                          type="number"
                          value={filter.min}
                          onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Max Value</Form.Label>
                        <Form.Control
                          type="number"
                          value={filter.max}
                          onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                </>
              )}
              {filters.length > 1 && (
                <Button variant="danger" onClick={() => removeFilter(index)}>Remove Filter</Button>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleCloseModal}>Apply Filters</Button>
        </Modal.Footer>
      </Modal>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Table striped bordered hover {...provided.droppableProps} ref={provided.innerRef}>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <Draggable key={column} draggableId={column} index={index}>
                      {(provided) => (
                        <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <FaGripVertical className="mr-2" />
                          {column}
                        </th>
                      )}
                    </Draggable>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    {columns.map((column, i) => (
                      <td key={i}>{item[column] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className="page-item">
            <Button className="page-link" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
              Previous
            </Button>
          </li>
          <li className="page-item">
            <Button className="page-link" onClick={() => handlePageChange('next')} disabled={currentPage * itemsPerPage >= filteredInfos.length}>
              Next
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
