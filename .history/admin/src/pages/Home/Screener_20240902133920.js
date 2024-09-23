import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap);
        setInfos(sortedData);
        setFilteredInfos(sortedData);
      });
  }, []);

  useEffect(() => {
    const initialColumns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap'];
    const newColumns = [
      ...initialColumns,
      ...filters
        .map(f => f.filterType)
        .filter(f => f && !initialColumns.includes(f))
    ];
    setColumns(newColumns);
  }, [filters]);

  useEffect(() => {
    const applyFilters = () => {
      return infos.filter(info => {
        const matchesQuery =
          info.Name.toLowerCase().includes(query.toLowerCase()) ||
          info.symbol.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true;

          if (filterType === 'eligiblePea') return (info[filterType] ? 'Oui' : 'Non') === selectedOption;

          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
            const value = parseFloat(info[filterType]);
            if (isNaN(value)) return true;
            if (min && value < parseFloat(min)) return false;
            if (max && value > parseFloat(max)) return false;
            return true;
          }

          return info[filterType] === selectedOption;
        });

        return matchesQuery && matchesFilters;
      });
    };

    if (secondSelectChanged) {
      const filtered = applyFilters();
      const sortedFiltered = filtered.sort((a, b) => b.marketcap - a.marketcap);
      setFilteredInfos(sortedFiltered);
      setSecondSelectChanged(false);
    } else {
      setFilteredInfos(prevFilteredInfos => prevFilteredInfos.filter(info =>
        info.Name.toLowerCase().includes(query.toLowerCase()) ||
        info.symbol.toLowerCase().includes(query.toLowerCase())
      ));
    }
  }, [filters, secondSelectChanged, query, infos]);

  useEffect(() => {
    if (query.length > 2) {
      const matchedSuggestions = infos
        .map(info => ({ Name: info.Name, symbol: info.symbol }))
        .filter(info =>
          info.Name.toLowerCase().includes(query.toLowerCase()) ||
          info.symbol.toLowerCase().includes(query.toLowerCase())
        );
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, infos]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;

    if (field === 'filterType') {
      newFilters[index].selectedOption = '';
      newFilters[index].min = '';
      newFilters[index].max = '';
      setSecondSelectChanged(false);
    }

    if (field === 'selectedOption' || field === 'min' || field === 'max') {
      setSecondSelectChanged(true);
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
    if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filterType)) {
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

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.Name || suggestion.symbol);
    setSuggestions([]);
  };

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Screener Quanti</h2>
          <p>Total entreprises : {filteredInfos.length}</p>
        </div>
        <div className="col-md-6 d-flex align-items-center position-relative">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher par nom ou symbole"
            value={query}
            onChange={handleQueryChange}
          />
          {suggestions.length > 0 && (
            <ul className="list-group position-absolute" style={{ top: '100%', zIndex: 1000, width: '100%' }}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.Name} ({suggestion.symbol})
                </li>
              ))}
            </ul>
          )}
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Filtres
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filtres avancés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div className="mb-3" key={index}>
              <select
                className="form-select mb-2"
                value={filter.filterType}
                onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
              >
                <option value="">Sélectionnez un type de filtre</option>
                <option value="eligiblePea">Éligibilité PEA</option>
                <option value="secteur">Secteur</option>
                <option value="pays">Pays</option>
                <option value="industrie">Industrie</option>
                <option value="buyback_yield">Rendement de rachat</option>
                <option value="croissance_CA_1_an">Croissance CA 1 an</option>
                <option value="croissance_CA_5_ans">Croissance CA 5 ans</option>
                <option value="croissance_CA_10_ans">Croissance CA 10 ans</option>
                <option value="fcf_1_year">FCF 1 an</option>
                <option value="fcf_5_years">FCF 5 ans</option>
                <option value="fcf_10_years">FCF 10 ans</option>
                <option value="fcf_margin_one_year">Marge FCF 1 an</option>
                <option value="fcf_margin_five_year">Marge FCF 5 ans</option>
                <option value="croissance_annualisee">Croissance annualisée</option>
                <option value="croissance_moyenne">Croissance moyenne</option>
                <option value="debt_equity">Ratio dette / capital</option>
                <option value="ratio_payout">Ratio de distribution</option>
                <option value="performance">Performance</option>
                <option value="roce">ROCE</option>
                <option value="roce_5_year_avg">ROCE Moy 5 ans</option>
                <option value="croissance_resultat_net_1_an">Croissance résultat net 1 an</option>
                <option value="croissance_resultat_net_5_ans">Croissance résultat net 5 ans</option>
                <option value="nbreannee">Stabilité des résultats sur les années</option>
              </select>
              {filter.filterType && getFilterOptions(filter.filterType).length > 0 && (
                <select
                  className="form-select mb-2"
                  value={filter.selectedOption}
                  onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                >
                  <option value="">Sélectionnez une option</option>
                  {getFilterOptions(filter.filterType).map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {filter.filterType && ['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) && (
                <div className="row">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filter.min}
                      onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filter.max}
                      onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                    />
                  </div>
                </div>
              )}
              <Button variant="danger" onClick={() => removeFilter(index)} className="mt-2">
                Supprimer
              </Button>
            </div>
          ))}
          <Button variant="success" onClick={addFilter}>
            Ajouter un filtre
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      <table className="table table-bordered">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((info, index) => (
            <tr key={index}>
              <td>{info.Name}</td>
              <td>{info.pays}</td>
              <td>{info.secteur}</td>
              <td>{info.industrie}</td>
              <td>{formatNumber(info.marketcap)} Md€</td>
              {filters.map((filter, i) => (
                <td key={i}>
                  {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee'].includes(filter.filterType) ? (
                    <span>{info[filter.filterType]}</span>
                  ) : (
                    <span>{info[filter.filterType]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-4">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Page précédente
        </Button>
        <span>Page {currentPage} sur {totalPages}</span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Page suivante
        </Button>
      </div>
    </section>
  );
}
