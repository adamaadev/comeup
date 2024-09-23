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

  // Drag and drop functions
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);

    setColumns(reorderedColumns);
  };

  const ratioNames = {
    'exchangeShortName': 'exchange',
    'Name' : "Nom",
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
    // Obtenir les ratios déjà sélectionnés dans d'autres filtres
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);
  
    // Retourner les ratios qui ne sont pas encore sélectionnés
    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };
  
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  useEffect(() => {
    const initialColumns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap','exchangeShortName'];
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Rechercher..."
      />
      <div>
        {filters.map((filter, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <select
              value={filter.filterType}
              onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
            >
              <option value="">-- Sélectionner un filtre --</option>
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
                  <option value="">-- Sélectionner une option --</option>
                  {getFilterOptions(filter.filterType).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {(filter.filterType === 'buyback_yield' || filter.filterType === 'fcf_1_year' || filter.filterType === 'fcf_5_years' || filter.filterType === 'fcf_10_years' || filter.filterType === 'fcf_margin_one_year' || filter.filterType === 'fcf_margin_five_year' || filter.filterType === 'roce' || filter.filterType === 'roce_5_year_avg' || filter.filterType === 'croissance_resultat_net_1_an' || filter.filterType === 'croissance_resultat_net_5_ans' || filter.filterType === 'croissance_CA_1_an' || filter.filterType === 'croissance_CA_5_ans' || filter.filterType === 'croissance_CA_10_ans' || filter.filterType === 'croissance_annualisee' || filter.filterType === 'croissance_moyenne' || filter.filterType === 'debt_equity' || filter.filterType === 'ratio_payout' || filter.filterType === 'performance' || filter.filterType === 'nbreannee') && (
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
              </>
            )}
            {filters.length > 1 && (
              <button onClick={() => removeFilter(index)}>Supprimer le filtre</button>
            )}
          </div>
        ))}
        <button onClick={addFilter}>Ajouter un filtre</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <thead ref={provided.innerRef} {...provided.droppableProps}>
              <tr>
                {columns.map((column, index) => (
                  <Draggable key={column} draggableId={column} index={index}>
                    {(provided) => (
                      <th
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          cursor: 'move',
                        }}
                      >
                        {ratioNames[column] || column}
                        <FaGripVertical />
                      </th>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tr>
            </thead>
          )}
        </Droppable>
      </DragDropContext>

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{ratioNames[column] || column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((info, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{info[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Précédent</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivant</button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Formulaire pour ajouter une question</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
