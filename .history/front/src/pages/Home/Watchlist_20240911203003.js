import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Watchlist() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const itemsPerPage = 20;

  useEffect(() => {
    // Chargement des données depuis l'API
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation); // Trier les données par capitalisation
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialiser les infos filtrées avec toutes les entreprises
      });
  }, []);

  // Fonction de filtrage par recherche
  const handleQueryChange = (event) => {
    const newQuery = event.target.value.toLowerCase();
    setQuery(newQuery);

    if (newQuery === '') {
      // Si la recherche est vide, afficher toutes les entreprises
      setFilteredInfos(infos);
    } else {
      const filtered = infos.filter(info => {
        const symbol = info.symbol?.toLowerCase();

        // Garder les symboles exacts
        if (symbol === newQuery) {
          return true;
        }

        // Calculer le nombre de lettres communes entre le symbole et la requête
        const commonLetters = symbol.split('').filter(char => newQuery.includes(char)).length;

        // Ne garder que les symboles ayant 2 lettres communes ou moins
        return commonLetters <= 2;
      });

      setFilteredInfos(filtered);
    }
  };

  // Pagination
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

  // Formatage des nombres
  const formatNumber = (num) => {
    const formattedNumber = (num / 1e9).toFixed(2);
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
        </div>
      </div>

      {/* Affichage du tableau */}
      <table className="table" style={{ width: '100%', tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Pays</th>
            <th>Secteur</th>
            <th>Industrie</th>
            <th>Capitalisation (MDS)</th>
            <th>Pea</th>
            <th>Dividende</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((info, index) => (
            <tr
              key={index}
              onClick={() => window.open(`/details/${info.symbol}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              <td>
                <div className="d-flex align-items-center">
                  {info.logo ? (
                    <img
                      src={info.logo}
                      alt={`${info.Nom} logo`}
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
              </td>
              <td>{info.pays || '-'}</td>
              <td>{info.secteur || '-'}</td>
              <td>{info.industrie || '-'}</td>
              <td>{info.Capitalisation ? formatNumber(info.Capitalisation) : '-'}</td>
              <td>{info.Pea === 1 ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
              <td>{info.Dividende === 1 ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
