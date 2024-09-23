import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';

export default function Watchlist() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  // Fonction pour obtenir les suggestions basées sur la saisie
  const getSuggestions = (query) => {
    if (!query) return [];
    return infos
      .filter(info => info.Nom.toLowerCase().includes(query.toLowerCase()))
      .map(info => info.Nom);
  };

  useEffect(() => {
    const savedColumns = localStorage.getItem('draggedColumns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        console.log(res.data);
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
  
          // Vérifier si le filtre est appliqué à 'eligiblePea'
          if (filterType === 'eligiblePea') {
            return (info[filterType] ? 'Oui' : 'Non') === selectedOption;
          }
  
          // Filtre pour les champs numériques avec min/max
          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
            const value = parseFloat(info[filterType]);
            if (isNaN(value)) return true; // Si la valeur n'est pas un nombre, ignorer les filtres min/max
            if (min && value < parseFloat(min)) return false;
            if (max && value > parseFloat(max)) return false;
            return true;
          }
  
          // Si aucun selectedOption n'est choisi, ne pas appliquer le filtre
          if (!selectedOption) return true;
  
          // Filtre pour les autres champs (comme pays, secteur, industrie)
          return info[filterType] === selectedOption;
        });
  
        return matchesQuery && matchesFilters;
      });
    };
  
    // Appliquer les filtres à chaque changement
    const filtered = applyFilters();
    const sortedFiltered = filtered.sort((a, b) => b.Capitalisation - a.Capitalisation);
    setFilteredInfos(sortedFiltered);
    
    // Mettre à jour les suggestions lorsque les infos sont filtrées
    setSuggestions(getSuggestions(query));
  }, [filters, query, infos]);

  // Fonction pour gérer la suppression d'un filtre
  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    setSecondSelectChanged(true); // Pour réappliquer les filtres après suppression
  };

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
  
    if (newQuery === '') {
      // Si la barre de recherche est vide, réinitialiser les résultats filtrés
      setFilteredInfos(infos);
    } else {
      setSecondSelectChanged(true); // Forcer la réapplication des filtres avec la nouvelle recherche
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
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          )}
          <button className="btn btn-primary ms-2" onClick={() => setShowModal(true)}>
            Ajouter un filtre
          </button>
        </div>
      </div>

      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          const reorderedColumns = Array.from(columns);
          const [removed] = reorderedColumns.splice(result.source.index, 1);
          reorderedColumns.splice(result.destination.index, 0, removed);
          setColumns(reorderedColumns);
          localStorage.setItem('draggedColumns', JSON.stringify(reorderedColumns));
        }}
      >
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              className="columns"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => (
                <Draggable key={column} draggableId={column} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="column"
                    >
                      <span className="column-name">{column}</span>
                      <FaGripVertical className="drag-icon" />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((info, index) => (
            <tr key={index}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column === 'Capitalisation'
                    ? formatNumber(info[column])
                    : info[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn btn-secondary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className="page-info">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un filtre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index} className="mb-3">
              <div className="row">
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filter.filterType}
                    onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                  >
                    <option value="">Sélectionner un filtre</option>
                    <option value="sector">Secteur</option>
                    <option value="industry">Industrie</option>
                    <option value="pays">Pays</option>
                    <option value="buyback_yield">Buyback Yield</option>
                    <option value="fcf_1_year">FCF 1 an</option>
                    <option value="fcf_5_years">FCF 5 ans</option>
                    <option value="fcf_10_years">FCF 10 ans</option>
                    <option value="fcf_margin_one_year">FCF Margin 1 an</option>
                    <option value="fcf_margin_five_year">FCF Margin 5 ans</option>
                    <option value="roce">ROCE</option>
                    <option value="roce_5_year_avg">ROCE 5 ans moyen</option>
                    <option value="croissance_resultat_net_1_an">Croissance Résultat Net 1 an</option>
                    <option value="croissance_resultat_net_5_ans">Croissance Résultat Net 5 ans</option>
                    <option value="croissance_CA_1_an">Croissance CA 1 an</option>
                    <option value="croissance_CA_5_ans">Croissance CA 5 ans</option>
                    <option value="croissance_CA_10_ans">Croissance CA 10 ans</option>
                    <option value="croissance_annualisee">Croissance Annualisée</option>
                    <option value="croissance_moyenne">Croissance Moyenne</option>
                    <option value="debt_equity">Debt/Equity</option>
                    <option value="ratio_payout">Ratio Payout</option>
                    <option value="performance">Performance</option>
                    <option value="nbreannee">Nombre d'années</option>
                    <option value="eligiblePea">Éligible PEA</option>
                  </select>
                </div>
                <div className="col-md-4">
                  {getFilterOptions(filter.filterType).length > 0 && (
                    <select
                      className="form-select"
                      value={filter.selectedOption}
                      onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                    >
                      <option value="">Sélectionner une option</option>
                      {getFilterOptions(filter.filterType).map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) && (
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Min"
                          value={filter.min}
                          onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Max"
                          value={filter.max}
                          onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFilter(index)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={addFilter}>
            Ajouter un autre filtre
          </button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
