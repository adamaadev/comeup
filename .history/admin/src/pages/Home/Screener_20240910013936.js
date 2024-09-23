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
  const [suggestions, setSuggestions] = useState([]);
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

        // Préparer les suggestions
        const symbolSuggestions = sortedData.map(item => item.symbol);
        setSuggestions(symbolSuggestions);
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

  const handleQueryChange = (event) => {
    const newQuery = event.target.value.toUpperCase();
    setQuery(newQuery);

    // Filtrer les suggestions en fonction de la requête
    const filteredSuggestions = suggestions.filter(symbol =>
      symbol === newQuery
    );
    
    setSuggestions(filteredSuggestions);

    if (newQuery === '') {
      setFilteredInfos(infos);
    } else {
      setSecondSelectChanged(true);
    }
  };

  // Fonction pour gérer la suppression d'un filtre
  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    setSecondSelectChanged(true); // Pour réappliquer les filtres après suppression
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
    // Convertir le nombre en milliards, et arrondir à 2 décimales
    const formattedNumber = (num / 1e9).toFixed(2);
    
    // Séparer le nombre en groupe avec l'espace insécable (U+202F) après le premier groupe de chiffres
    return `${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`; 
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
          {query && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setQuery(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Filtres
          </Button>
        </div>
      </div>
      {/* Modal et le reste du code ici... */}
    </section>
  );
}