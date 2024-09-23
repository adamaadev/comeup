import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        // Filtrer les entreprises basées aux États-Unis et sans point ou tiret dans leur symbole
        const filteredData = res.data.filter(info => 
          info.pays === 'Etats unis' && 
          !info.symbol.includes('.') && 
          !info.symbol.includes('-')
        );
        const sortedData = filteredData.sort((a, b) => b.Capitalisation - a.Capitalisation); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);
  

  useEffect(() => {
    const initialColumns = ['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation', 'exchangeShortName', 'Pea', 'Dividende'];
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
      // Si aucune recherche n'est effectuée, retourner toutes les entreprises
      if (!query && filters.length === 0) {
        // Trier les entreprises par capitalisation boursière en ordre décroissant
        const sortedByMarketCap = infos.slice().sort((a, b) => {
          const marketCapA = parseFloat(a.marketCap) || 0; // Assurez-vous que marketCap est bien défini
          const marketCapB = parseFloat(b.marketCap) || 0;
          return marketCapB - marketCapA; // Tri décroissant
        });

        return sortedByMarketCap;
      }

      const filtered = infos.filter(info => {
        // Vérification si la requête correspond (si query est présent)
        const matchesQuery = query
          ? info.symbol.toLowerCase().includes(query.toLowerCase()) ||
          info.Nom.toLowerCase().includes(query.toLowerCase())
          : true; // Pas de query, donc toujours true

        // Vérification si les filtres correspondent
        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true; // Si aucun filtre n'est sélectionné, passer
          

          // Gestion des filtres numériques
          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee', 'quanti'].includes(filterType)) {
            const value = parseFloat(info[filterType]);

            // Gérer les valeurs NaN
            if (isNaN(value)) return true;

            const minValue = min ? parseFloat(min) : null;
            const maxValue = max ? parseFloat(max) : null;

            if (minValue !== null && value < minValue) return false;
            if (maxValue !== null && value > maxValue) return false;

            return true;
          }

          // Gestion des options Non numériques (par exemple sélection d'une catégorie)
          if (selectedOption) {
            return info[filterType] === selectedOption;
          }

          return true;
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
          }
        }
      });

      // Convertir le Map en tableau
      const uniqueFiltered = Array.from(uniqueResults.values());

      // Trier les résultats filtrés par capitalisation boursière en ordre décroissant
      const sortedFiltered = uniqueFiltered.sort((a, b) => {
        const marketCapA = parseFloat(a.marketCap) || 0;
        const marketCapB = parseFloat(b.marketCap) || 0;
        return marketCapB - marketCapA; // Tri décroissant
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
          <h2 className="mb-0">Screener Quality</h2>
        </div>
        <div className="col-md-6 d-flex align-items-center flex-nowrap">
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
      <table className="table" style={{ width: '100%', tableLayout: 'auto' }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
         
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((info, index) => (
            <tr
              key={index}
              onClick={() => window.open(`/details/${info.symbol}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              {columns.map((col, idx) => {
                // Trouver l'index de la colonne "Dividende"
                const divIndex = columns.indexOf('Dividende');

                return (
                  <td
                    key={idx}
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      maxWidth: col === 'Nom' ? '300px' : '150px',
                      textAlign: col === 'Capitalisation' || col === 'Pea' || col === 'Dividende' ? 'center' : 'left',
                      paddingRight: col === 'Capitalisation' ? '50px' : '0', // Décaler à gauche
                      paddingLeft: idx > divIndex ? '50px' : '0', // Décaler les cellules après "Dividende"
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
                        info[col] === 'Oui' ? <FaCheck color="green" /> : <FaTimes color="red" />
                      ) : (
                        info[col]
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>
          {'<'}
        </button>
        <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
          {'>'}
        </button>

      </div>
    </section>
  );
}