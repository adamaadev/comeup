import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheck, FaTimes} from 'react-icons/fa';

export default function BourseImpact() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;
  const type = "admin";

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
    }else {
      // Colonnes par défaut si aucune sauvegarde
      setColumns(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
    }
  }, []);
  
  const ratioNames = {
    'exchangeShortName': 'exchange',
    'pays': 'Pays',
    'secteur': 'Secteur',
    'industrie': 'Industrie',
  };

  useEffect(() => {
      axios.post('http://localhost:4000/watchlist', { type })
        .then(res => {
            
        const sortedData = res.data.sort((a, b) => b.marketCap - a.marketCap); // Décroissant
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
      // Afficher toutes les entreprises si aucune recherche n'est effectuée
      if (query === '') {
        return infos;
      }
  
      const filtered = infos.filter(info => {
        const matchesQuery =
          info.symbol.toLowerCase().includes(query.toLowerCase()) ||
          info.Nom.toLowerCase().includes(query.toLowerCase());
  
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
  
      // Filtrer pour garder uniquement le premier résultat exact
      const uniqueResults = new Map();
      filtered.forEach(info => {
        const key = query.toLowerCase();
        if (info.symbol.toLowerCase().includes(key) || info.Nom.toLowerCase().includes(key)) {
          if (!uniqueResults.has(info.Nom)) {
            uniqueResults.set(info.Nom, info);
          } else {
            // Compare suffixes or symbols to select the most relevant
            const existing = uniqueResults.get(info.Nom);
            if (info.symbol.includes('.NE')) {
              uniqueResults.set(info.Nom, info);
            }
          }
        }
      });
  
      // Convertir le Map en tableau
      const uniqueFiltered = Array.from(uniqueResults.values());
  
      // Trier les résultats filtrés par symbole et nom
      const sortedFiltered = uniqueFiltered.sort((a, b) => {
        const symbolComparison = a.symbol.localeCompare(b.symbol);
        if (symbolComparison !== 0) return symbolComparison;
  
        return a.Nom.localeCompare(b.Nom);
      });
      return sortedFiltered;
    };
  
    const filteredInfos = applyFilters();
    setFilteredInfos(filteredInfos);
  }, [filters, query, infos]);
  

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
  
    if (newQuery === '') {
      // Réinitialiser les résultats filtrés pour afficher toutes les entreprises
      setFilteredInfos(infos);
    } else {
      setSecondSelectChanged(true); // Forcer la réapplication des filtres avec la nouvelle recherche
    }
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
          <h2 className="mb-0">WatchList Bourse Impact</h2>
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
      <table className="table" style={{ width: '100%', tableLayout: 'auto' }}>
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
                          style={{
                            ...provided.draggableProps.style,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span style={{ marginRight: '5px', fontWeight: 'bold', visibility: 'hidden' }}>P</span>
                            {col === 'Capitalisation' ? 'Capitalisation (MDS)' : ratioNames[col] || col}
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
            <tr
              key={index}
              onClick={() => window.open(`/details/${info.symbol}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: col === 'Nom' ? '300px' : '150px',
                    textAlign: col === 'Capitalisation' || col === 'Pea' || col === 'Dividende' ? 'center' : 'left',
                    paddingRight: col === 'Capitalisation' ? '50px' : '0', // Décaler à gauche
                  }}
                >
                  {col === 'Nom' ? (
                    <div className="d-flex align-items-center">
                      {info.logo ? (
                        <img
                          src={info.logo}
                          alt={`${info.Name} logo`}
                          width="50"
                          height="50"
                          style={{ display: 'block', marginRight: '10px' }}
                        />
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
                  ) : info[col] !== undefined ? (
                    col === 'Capitalisation' && info.Capitalisation ? (
                      formatNumber(info.Capitalisation)
                    ) : col === 'Pea' || col === 'Dividende' ? (
                      info[col] === 1 ? <FaCheck color="green" /> : <FaTimes color="red" />
                    ) : (
                      info[col]
                    )
                  ) : (
                    '-'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredInfos.length > 20 ? (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
              Précédent
            </button>
            <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Suivant
            </button>
          </div>
          <div className="ms-3">
            <a href="mailto:example@gmail.com" target="_blank" rel="noopener noreferrer" className="btn btn-link">
              <FaGoogle size={24} />
            </a>
          </div>
        </div>
      ) : (
        ""
      )}
    </section>
  );
}