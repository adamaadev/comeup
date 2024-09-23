import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);

  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        setInfos(res.data);
      });
  }, []);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;

    // Réinitialiser les valeurs min et max si le filtre change
    if (field === 'filterType') {
      newFilters[index].selectedOption = '';
      newFilters[index].min = '';
      newFilters[index].max = '';
    }

    setFilters(newFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const getFilterOptions = (filterType) => {
    if (!filterType) return [];
    if (filterType === 'eligiblePea') return ['Oui', 'Non']; // Options spécifiques pour eligiblePea
    return [...new Set(infos.map(info => info[filterType]))];
  };

  const filteredInfos = infos.filter(info => {
    return filters.every(({ filterType, selectedOption, min, max }) => {
      if (!filterType) return true;

      if (filterType === 'eligiblePea') return (info[filterType] ? 'Oui' : 'Non') === selectedOption;

      if (filterType === 'buyback_yield') {
        const buyback = parseFloat(info.buyback_yield);
        if (min && buyback < parseFloat(min)) return false;
        if (max && buyback > parseFloat(max)) return false;
        return true;
      }

      return info[filterType] === selectedOption;
    }) && (
      info.Name.toLowerCase().includes(query.toLowerCase()) ||
      info.symbol.toLowerCase().includes(query.toLowerCase())
    );
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
          <h2 className="mb-0">Screener Quanti</h2>
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
      {filters.map((filter, index) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-4">
            <select 
              className="form-control" 
              value={filter.filterType} 
              onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
            >
              <option value="">Sélectionner un filtre</option>
              <option value="pays">Pays</option>
              <option value="secteur">Secteur</option>
              <option value="industrie">Industrie</option>
              <option value="eligiblePea">PEA</option>
              <option value="buyback_yield">Rachat d'actions</option>
            </select>
          </div>

          {filter.filterType === 'buyback_yield' ? (
            <>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Min %" 
                  value={filter.min} 
                  onChange={(e) => handleFilterChange(index, 'min', e.target.value)} 
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Max %" 
                  value={filter.max} 
                  onChange={(e) => handleFilterChange(index, 'max', e.target.value)} 
                />
              </div>
            </>
          ) : (
            <div className="col-md-6">
              <select 
                className="form-control" 
                value={filter.selectedOption} 
                onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                disabled={!filter.filterType}
              >
                <option value="">Sélectionner une option</option>
                {getFilterOptions(filter.filterType).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-2">
            <button 
              className="btn btn-danger" 
              onClick={() => removeFilter(index)} 
              disabled={filters.length === 1}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
      <div className="mb-4">
        <button className="btn btn-primary" onClick={addFilter}>
          Ajouter un filtre
        </button>
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
