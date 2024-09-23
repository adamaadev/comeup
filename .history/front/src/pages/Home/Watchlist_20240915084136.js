import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function BourseImpact() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const itemsPerPage = 20;
  const [id, setid] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type: "user" })
      .then(res => {
        setid(res.data.id);
      });
  }, []);

  useEffect(() => {
    axios.post('http://localhost:4000/watchlist/user', { id })
      .then(res => {
        console.log(res);

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
            <th>Nom</th>
            <th>Pays</th>
            <th>Secteur</th>
            <th>Industrie</th>
            <th>Capitalisation (MDS)</th>
            <th>Pea</th>
            <th>Dividende</th>
            <th>Quali-Score</th> {/* Nouvelle colonne pour le score */}
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
              <td>{info.pays || '-'}</td>
              <td>{info.secteur || '-'}</td>
              <td>{info.industrie || '-'}</td>
              <td>{info.Capitalisation ? formatNumber(info.Capitalisation) : '-'}</td>
              <td>{info.Pea === 1 ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
              <td>{info.Dividende === 1 ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
              <td>{info.score} / 20</td> {/* Affichage du score */}
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
