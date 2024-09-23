import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('');  // Nouveau state pour le type de filtre
  const [filterOptions, setFilterOptions] = useState([]);  // Nouveau state pour les options de filtre
  const [selectedOption, setSelectedOption] = useState('');  // Nouveau state pour l'option sélectionnée

  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => setInfos(res.data));
  }, []);

  useEffect(() => {
    // Mise à jour des options disponibles selon le filtre choisi
    if (filterType) {
      const options = [...new Set(infos.map(info => info[filterType]))];
      setFilterOptions(options);
    }
  }, [filterType, infos]);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setSelectedOption('');  // Réinitialiser l'option sélectionnée lorsque le type de filtre change
  };

  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  const filteredInfos = infos.filter(info => {
    const matchesQuery = info.Name.toLowerCase().includes(query.toLowerCase()) || info.symbol.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filterType ? info[filterType] === selectedOption : true;
    return matchesQuery && matchesFilter;
  });

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
          <h2 className="mb-0">Screnner Quanti</h2>
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
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <select 
            className="form-control" 
            value={filterType} 
            onChange={handleFilterTypeChange}
          >
            <option value="">Sélectionner un filtre</option>
            <option value="pays">Pays</option>
            <option value="secteur">Secteur</option>
            <option value="industrie">Industrie</option>
            <option value="eligiblePea">PEA</option>
          </select>
        </div>
        <div className="col-md-6">
          <select 
            className="form-control" 
            value={selectedOption} 
            onChange={handleOptionChange}
            disabled={!filterType}
          >
            <option value="">Sélectionner une option</option>
            {filterOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
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
