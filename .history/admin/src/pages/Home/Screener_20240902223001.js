import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function Watchlist() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page
  const [showModal, setShowModal] = useState(false);

  const columns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap'];

  useEffect(() => {
    axios.get('https://api.example.com/data') // Remplacez par votre API
      .then(response => {
        const filteredData = response.data.filter(item => item.Name === 'Apple Inc.');
        setData(removeDuplicates(filteredData));
      })
      .catch(error => console.error(error));
  }, []);

  const removeDuplicates = (arr) => {
    const uniqueNames = new Set();
    return arr.filter(item => {
      if (!uniqueNames.has(item.Name)) {
        uniqueNames.add(item.Name);
        return true;
      }
      return false;
    });
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
  };

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handlePrevPage = () => setCurrentPage(prev => prev - 1);
  const handleNextPage = () => setCurrentPage(prev => prev + 1);

  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <section>
      <Button variant="primary" onClick={handleShowModal}>
        Ajouter des filtres
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index}>
              <select 
                className="form-select mb-2"
                value={filter.filterType}
                onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
              >
                <option value="">Sélectionnez un filtre</option>
                <option value="eligiblePea">Eligible PEA</option>
                <option value="secteur">Secteur</option>
                <option value="pays">Pays</option>
                <option value="industrie">Industrie</option>
                {/* Ajoutez d'autres options de filtre ici */}
              </select>

              {filter.filterType && (
                <select 
                  className="form-select mb-2"
                  value={filter.selectedOption}
                  onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                >
                  <option value="">Sélectionnez une option</option>
                  {/* Chargez dynamiquement les options disponibles pour ce filtre */}
                </select>
              )}

              <Button variant="danger" className="mt-2" onClick={() => removeFilter(index)}>
                Supprimer
              </Button>
            </div>
          ))}

          <Button variant="secondary" onClick={addFilter}>
            Ajouter un filtre
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              {columns.map(column => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(info => (
              <tr key={info.Name}>
                <td>{info.Name}</td>
                <td>{info.pays}</td>
                <td>{info.secteur}</td>
                <td>{info.industrie}</td>
                <td>{formatNumber(info.marketcap)} Mrd €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between">
        <Button variant="primary" onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </Button>
        <Button variant="primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </Button>
      </div>
    </section>
  );
}
