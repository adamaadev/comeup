import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']); // Initial columns

  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        setInfos(res.data);
      });
  }, []);

  useEffect(() => {
    // Update columns based on active filters
    const newColumns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap', ...filters.map(f => f.filterType).filter(f => f)];
    setColumns(newColumns);
  }, [filters]);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;

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
    if (filterType === 'eligiblePea') return ['Oui', 'Non'];
    if (['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filterType)) {
      return [];
    }
    return [...new Set(infos.map(info => info[filterType]))];
  };

  const filteredInfos = infos.filter(info => {
    return filters.every(({ filterType, selectedOption, min, max }) => {
      if (!filterType) return true;

      if (filterType === 'eligiblePea') return (info[filterType] ? 'Oui' : 'Non') === selectedOption;

      if (['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filterType)) {
        const value = parseFloat(info[filterType]);
        if (min && value < parseFloat(min)) return false;
        if (max && value > parseFloat(max)) return false;
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
              <option value="croissance_CA_1_an">Croissance CA 1 an</option>
              <option value="croissance_CA_5_ans">Croissance CA 5 ans</option>
              <option value="croissance_CA_10_ans">Croissance CA 10 ans</option>
              <option value="croissance_annualisee">Croissance Annualisée</option>
              <option value="croissance_moyenne">Croissance Moyenne</option>
              <option value="croissance_resultat_net_1_an">Croissance Résultat Net 1 an</option>
              <option value="croissance_resultat_net_5_ans">Croissance Résultat Net 5 ans</option>
            </select>
          </div>

          {filter.filterType === 'buyback_yield' || ['croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filter.filterType) ? (
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
                  {columns.map(col => (
                    <th key={col} style={{ whiteSpace: 'nowrap' }}>
                      {col === 'marketcap' ? 'Capitalisation (MDS)' : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map(company => (
                   <td className="d-flex align-items-center">
                   <img src={company.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }}/>
                   <div>
                     <div>{company.Name}</div>
                     <div>{company.symbol} : <strong>{company.sector}</strong></div>
                   </div>
                 </td>
                  <tr key={company.Name}>
                    {columns.map(col => (
                      <td key={col}>
                        {col === 'marketcap' ? formatNumber(company[col]) : company[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                Précédent
              </button>
              <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Suivant
              </button>
            </div>
          </>
        ) : (
          <p>Aucune donnée disponible</p>
        )}
      </div>
    </section>
  );
}
