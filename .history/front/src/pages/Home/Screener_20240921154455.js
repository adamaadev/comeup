import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Watchlist() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const itemsPerPage = 20;
  const [id, setid] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:4000/watchlist/user', { id })
      .then(res => {

        const sortedData = res.data // Trier les données par capitalisation
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialiser les infos filtrées avec toutes les entreprises
      });
  }, [id]);

  useEffect(() => {
    setColumns([
      'Nom',
      'pays',
      'secteur',
      'industrie',
      'Capitalisation',
      'exchangeShortName',
      'Pea',
      'Dividende',
      'Score'
    ]);
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      // Afficher toutes les entreprises si aucune recherche n'est effectuée
      if (query === '') {
        return infos;
      }

      return infos.filter(info =>
        info.symbol.toLowerCase().includes(query.toLowerCase()) ||
        info.Nom.toLowerCase().includes(query.toLowerCase())
      );
    };

    const filteredInfos = applyFilters();
    setFilteredInfos(filteredInfos);
  }, [query, infos]);

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery === '') {
      // Réinitialiser les résultats filtrés pour afficher toutes les entreprises
      setFilteredInfos(infos);
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

  const getScoreColor = (score) => {
    if (score >= 16) return 'green';
    if (score >= 11) return 'yellow';
    return 'red';
  };

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Ma watchlist</h2>
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
            <th style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Nom</th>
            <th style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pays</th>
            <th style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Secteur</th>
            <th style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Industrie</th>
            <th style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Capitalisation (MDS)</th>
            <th className="text-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pea</th>
            <th className="text-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dividende</th>
            <th className="text-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Quali-Score</th>
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
              </td>
              <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.pays || '-'}</td>
              <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.secteur || '-'}</td>
              <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.industrie || '-'}</td>
              <td className="text-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.Capitalisation ? formatNumber(info.Capitalisation) : '-'}
              </td>
              <td className="text-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.Pea === "Oui" ? <FaCheck color="green" /> : <FaTimes color="red" />}
              </td>
              <td className="text-center" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.Dividende === "Oui" ? <FaCheck color="green" /> : <FaTimes color="red" />}
              </td>
              <td className="text-center" style={{ color: getScoreColor(info.score), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.score} / 20
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredInfos.length > 20 ? <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>
          {'<'}
        </button>
        <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
          {'>'}
        </button>
      </div> : ""}
    </section>
  );
}