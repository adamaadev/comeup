import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']); // Initial columns

  const itemsPerPage = 20;
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        setInfos(res.data);
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
           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Ajouter un filtre
           </button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Changer le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
        </Modal.Body>
      </Modal>
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
                {currentItems.map((info, index) => (
                  <tr key={index}>
                   <td className="d-flex align-items-center">
                      <img src={info.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }}/>
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
