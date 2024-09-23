import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [industrie, setindustrie] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        setInfos(res.data);

        // Extract unique industrie from the data
        const uniqueindustrie = [...new Set(res.data.map(info => info.pays))];
        setindustrie(uniqueindustrie);

        // Log industrie to the console
        console.log('industrie:', uniqueindustrie);
      });
  }, []);

  const handleQueryChange = (event) => setQuery(event.target.value);
  const handleCountryChange = (event) => setSelectedCountry(event.target.value);

  const filteredInfos = infos.filter(info =>
    (info.Name.toLowerCase().includes(query.toLowerCase()) ||
    info.symbol.toLowerCase().includes(query.toLowerCase())) &&
    (selectedCountry === '' || info.pays === selectedCountry)
  );

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
          <h2 className="mb-0">Scenner Quanti</h2>
        </div>
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Rechercher sur la liste" 
            value={query}
            onChange={handleQueryChange}
          />
        </div>
        <div className="col-md-6 mt-2">
          <select className="form-control" value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Tous les pays</option>
            {industrie.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive">
        {currentItems.length > 0 ? (
          <>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Pays</th>
                  <th>Secteur</th>
                  <th>Industrie</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Capitalisation (MDS)</th>
                  <th>PEA</th>
                  <th>Dividende</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(company => (
                  <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                    <td className="d-flex align-items-center">
                      <img src={company.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }}/>
                      <div>
                        <div>{company.Name}</div>
                        <div>{company.symbol} : <strong>{company.exchangeShortName}</strong></div>
                      </div>
                    </td>
                    <td>{company.pays}</td>
                    <td>{company.secteur}</td>
                    <td>{company.industrie}</td>
                    <td>{formatNumber(company.marketcap)}</td>
                    <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                    <td>{company.VerseDividende ? 'Oui' : 'Non'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-primary" 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button 
                className="btn btn-primary" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </>
        ) : (
          <div className="alert alert-warning" role="alert">
            Aucune entreprise disponible
          </div>
        )}
      </div>
    </section>
  );
}
