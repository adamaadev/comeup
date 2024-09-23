import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        setInfos(res.data);
        setFilteredInfos(res.data);
      });
  }, []);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    applyFilters(filters, event.target.value);
  };

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

  const handleSecondSelectChange = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].selectedOption = value;
    setFilters(newFilters);
    applyFilters(newFilters, query);
  };

  const applyFilters = (appliedFilters, queryValue) => {
    const filtered = infos.filter(info => {
      return appliedFilters.every(({ filterType, selectedOption, min, max }) => {
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
        info.Name.toLowerCase().includes(queryValue.toLowerCase()) ||
        info.symbol.toLowerCase().includes(queryValue.toLowerCase())
      );
    });

    setFilteredInfos(filtered);
  };

  const addFilter = () => {
    setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    applyFilters(newFilters, query);
  };

  const getFilterOptions = (filterType) => {
    if (!filterType) return [];
    if (filterType === 'eligiblePea') return ['Oui', 'Non'];
    if (['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filterType)) {
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

  return (
    <div>
      <input 
        type="text" 
        value={query} 
        onChange={handleQueryChange} 
        placeholder="Rechercher..."
      />
      
      {filters.map((filter, index) => (
        <div key={index}>
          <select 
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

          {filter.filterType && !['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filter.filterType) && (
            <select 
              value={filter.selectedOption} 
              onChange={(e) => handleSecondSelectChange(index, e.target.value)}
            >
              <option value="">Sélectionner une option</option>
              {getFilterOptions(filter.filterType).map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filter.filterType) && (
            <>
              <input 
                type="number" 
                value={filter.min} 
                onChange={(e) => handleFilterChange(index, 'min', e.target.value)} 
                placeholder="Min %" 
              />
              <input 
                type="number" 
                value={filter.max} 
                onChange={(e) => handleFilterChange(index, 'max', e.target.value)} 
                placeholder="Max %" 
              />
            </>
          )}

          <button onClick={() => removeFilter(index)}>Supprimer</button>
        </div>
      ))}

      <button onClick={addFilter}>Ajouter un filtre</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Pays</th>
            <th>Secteur</th>
            <th>Industrie</th>
            <th>MarketCap</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((info, index) => (
            <tr key={index}>
              <td>{info.Name}</td>
              <td>{info.pays}</td>
              <td>{info.secteur}</td>
              <td>{info.industrie}</td>
              <td>{(info.marketcap / 1e9).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédent</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivant</button>
      </div>
    </div>
  );
}
