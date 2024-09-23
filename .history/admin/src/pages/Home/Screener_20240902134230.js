import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function Screener() {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const filteredSuggestions = companies
        .filter((company) =>
          company.Name.toLowerCase().includes(query.toLowerCase())
        )
        .map((company) => company.Name);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...filters];
    updatedFilters[index][field] = value;
    setFilters(updatedFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
  };

  const removeFilter = (index) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  const getFilterOptions = (filterType) => {
    switch (filterType) {
      case 'pays':
        return ['USA', 'France', 'Germany', 'Japan'];
      case 'secteur':
        return ['Technology', 'Healthcare', 'Finance'];
      case 'industrie':
        return ['Software', 'Pharmaceuticals', 'Banking'];
      default:
        return [];
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredCompanies = companies.filter((company) =>
    company.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = ['Nom', 'Pays', 'Secteur', 'Industrie', 'Capitalisation'];

  filters.forEach((filter) => {
    columns.push(filter.filterType);
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Rechercher une entreprise"
        className="form-control mb-3"
      />
      {suggestions.length > 0 && (
        <ul className="list-group">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <Button variant="primary" onClick={handleOpenModal}>
        Ajouter un filtre
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter des filtres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index} className="mb-3">
              <select
                className="form-select"
                value={filter.filterType}
                onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
              >
                <option value="">Sélectionnez un filtre</option>
                <option value="pays">Pays</option>
                <option value="secteur">Secteur</option>
                <option value="industrie">Industrie</option>
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
                  <div class="col">
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
              <td>{info.Country}</td>
              <td>{info.Sector}</td>
              <td>{info.Industry}</td>
              <td>{formatNumber(info.Cap)}</td>
              {filters.map((filter, filterIndex) => (
                <td key={filterIndex}>{info[filter.filterType]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-3">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          Précédent
        </Button>
        <span>Page {currentPage} sur {totalPages}</span>
        <Button
          variant="outline-primary"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Suivant
        </Button>
      </div>
    </section>
  );
}
