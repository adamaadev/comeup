import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const filteredData = res.data.filter(info => !info.symbol.includes('.') && !info.symbol.includes('-'));
        const sortedData = filteredData.sort((a, b) => b.Capitalisation - a.Capitalisation); 
        setInfos(sortedData);
        setFilteredInfos(sortedData); 
      });
  }, []);

  const applyFilters = () => {
    let filtered = infos.filter(info => {
      const matchesFilters = filters.every(({ filterType, min, max }) => {
        if (!filterType) return true; 

        // Filtrage pour les valeurs numériques
        if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'roce', 'croissance_resultat_net_1_an'].includes(filterType)) {
          const value = parseFloat(info[filterType]); 
          if (isNaN(value)) return false; 

          const minValue = min ? parseFloat(min) : null;
          const maxValue = max ? parseFloat(max) : null;

          if (minValue !== null && value < minValue) return false; 
          if (maxValue !== null && value > maxValue) return false;

          return true;
        }
        return true;
      });

      return matchesFilters;
    });

    setFilteredInfos(filtered); 
  };

  useEffect(() => {
    applyFilters();
  }, [filters, infos]);

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  return (
    <div>
      <h2>Screener</h2>
      <Button onClick={() => setShowModal(true)}>Filtres</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un filtre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index}>
              <select
                value={filter.filterType}
                onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
              >
                <option value="">Sélectionner un filtre</option>
                <option value="buyback_yield">Buyback Yield</option>
                <option value="fcf_1_year">FCF 1 an</option>
              </select>

              <input
                type="number"
                placeholder="Min"
                value={filter.min}
                onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
              />

              <input
                type="number"
                placeholder="Max"
                value={filter.max}
                onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
              />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredInfos.map((info, index) => (
            <tr key={index}>
              <td>{info.Nom}</td>
              <td>{info.pays}</td>
              <td>{info.secteur}</td>
              <td>{info.industrie}</td>
              <td>{info.Capitalisation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
