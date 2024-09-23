import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical, FaCheck, FaTimes} from 'react-icons/fa';
export default function Watchlist() {
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
        console.log(res.da);
        
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  useEffect(() => {
    const initialColumns = ['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation', 'exchangeShortName','Pea' , 'Dividende'];
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
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Filtres
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un filtre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div className="row mb-3" key={index}>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={filter.filterType}
                  onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                >
                  <option value="">Sélectionner un filtre</option>
                  {getAvailableRatioOptions(index).map(type => (
                    <option key={type} value={type}>{ratioNames[type]}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                {filter.filterType === 'eligiblePea' ? (
                  <select
                    className="form-control"
                    value={filter.selectedOption}
                    onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                  >
                    <option value="">Sélectionner une option</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                ) : (
                  <>
                    {['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'piotroski_score', 'ratio_capex_revenu_net', 'rachat_net_moyen', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Min"
                          value={filter.min}
                          onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                        />
                        <input
                          type="number"
                          className="form-control mt-2"
                          placeholder="Max"
                          value={filter.max}
                          onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                        />
                      </>
                    ) : (
                      <select
                        className="form-control"
                        value={filter.selectedOption}
                        onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                      >
                        <option value="">Sélectionner une option</option>
                        {getFilterOptions(filter.filterType).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
              <div className="col-md-4">
                <button className="btn btn-danger" onClick={() => removeFilter(index)}>
                  X
                </button>
              </div>
            </div>
          ))}
          {filters.length < 2 && (
            <button onClick={addFilter} className='btn btn-primary'>
              Ajouter un filtre
            </button>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      <table className="table">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided) => (
              <thead ref={provided.innerRef} {...provided.droppableProps}>
                <tr>
                  {columns.map((col, idx) => (
                    <Draggable key={col} draggableId={col} index={idx}>
                      {(provided) => (
                        <th
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, whiteSpace: 'nowrap' }}
                        >
                          <div className="d-flex align-items-center">
                            <FaGripVertical />
                            {ratioNames[col] || col}
                          </div>
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
     
<tbody>
  {currentItems.map((info, index) => (
    <tr key={index} onClick={() => window.open(`/details/${info.symbol}`, '_blank')} style={{ cursor: 'pointer' }}>
      {columns.map((col, idx) => (
        <td key={idx}>
          {col === 'Nom' ? (
            <div className="d-flex align-items-center">
              {info.logo ? (
                <img src={info.logo} alt={`${info.Name} logo`} width="50" height="50" style={{ display: 'block', marginRight: '10px' }} />
              ) : null}
              <div>
                {info.Nom}
                {info.symbol && info.exchangeShortName && (
                  <div style={{ fontSize: '0.9em' }}>
                    <span>{info.symbol} </span>
                    <span style={{ fontWeight: 'bold' }}> : {info.exchangeShortName}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            info[col] !== undefined ? (
              col === 'Capitalisation' && info.Capitalisation ? (
                formatNumber(info.Capitalisation)
              ) : (
                col === 'PEA' || col === 'Dividende' ? (
                  info[col] === 1 ? <FaCheck /> : <FaTimes />
                ) : (
                  info[col]
                )
              )
            ) : (
              '-'
            )
          )}
        </td>
      ))}
    </tr>
  ))}
</tbody>

      </table>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </div>
    </section>
  );
}