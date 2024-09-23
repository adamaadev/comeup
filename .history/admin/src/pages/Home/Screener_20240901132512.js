import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const itemsPerPage = 20;
  const handleCloseModal = () => setShowModal(false);

  // Charger les données et trier par marketcap de manière décroissante
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap); // Décroissant
        setInfos(sortedData);
      });
  }, []);

  useEffect(() => {
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
    if (['buyback_yield', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filterType)) {
      return [];
    }
    return [...new Set(infos.map(info => info[filterType]))];
  };

  useEffect(() => {
    if (secondSelectChanged) {
      const filtered = infos.filter(info => {
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
      setFilteredInfos(filtered);
    } else {
      setFilteredInfos(infos);
    }
  }, [filters, secondSelectChanged, query, infos]);

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
        <div className="col-md-6 d-flex align-items-center">
          <input 
            type="text" 
            className="form-control me-2" 
            placeholder="Rechercher sur la liste" 
            value={query}
            onChange={handleQueryChange}
          />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Filtres
          </button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              >
                <option value="">Sélectionner une option</option>
                {getFilterOptions(filter.filterType).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-2">
            <button 
              className="btn btn-danger" 
              onClick={() => removeFilter(index)}
            >
              X
            </button>
          </div>
        </div>
      ))}

      <button className="btn btn-primary" onClick={addFilter}>
        Ajouter un filtre
      </button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="table-responsive">
        
      {currentItems.length > 0 ? (
  <table className="table table-striped">
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {currentItems.map((info, index) => (
        <tr key={index}>
          <td className="d-flex align-items-center">
            <img
              src={info.logo}
              width="50"
              height="50"
              style={{ display: 'block', marginRight: '10px' }}
              alt={info.Name} // Ajoutez un attribut alt pour l'accessibilité
            />
            <div>
              <div>{info.Name}</div>
              <div>{info.symbol} : <strong>{info.exchangeShortName}</strong></div>
            </div>
          </td>
          {columns.slice(1).map((col, idx) => (
            <td key={idx}>
              {col === 'marketcap' ? formatNumber(info[col]) : info[col]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <div className="alert alert-warning text-center" role="alert">
    Aucune entreprise disponible
  </div>
)}

<div className="d-flex justify-content-between">
  <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>
    &lt;
  </button>
  <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
    &gt;
  </button>
</div>
      </div>
    </section>
  );
}
