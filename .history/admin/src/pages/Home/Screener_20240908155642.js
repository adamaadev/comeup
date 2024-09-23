import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
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
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation); // Décroissant
        setInfos(sortedData);
      });
  }, []);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = infos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(infos.length / itemsPerPage);

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
        </div>
      </div>

      <div className="table-responsive">
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="table">
            <thead>
              <Droppable droppableId="columns" direction="horizontal">
                {(provided) => (
                  <tr {...provided.droppableProps} ref={provided.innerRef}>
                    {columns.map((col, index) => (
                      <Draggable key={col} draggableId={col} index={index}>
                        {(provided) => (
                          <th
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FaGripVertical /> {col}
                          </th>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tr>
                )}
              </Droppable>
            </thead>
            <tbody>
              {currentItems.map((info, index) => (
                <tr key={index}>
                  {columns.map((col, i) => (
                    <td key={i}>{info[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </DragDropContext>
      </div>

      <div className="d-flex justify-content-between">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </Button>
      </div>
    </section>
  );
}
