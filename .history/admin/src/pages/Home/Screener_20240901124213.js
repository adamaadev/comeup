import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from "react-bootstrap";
import { formatNumber } from './Convert';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]); // Ajoutez cette ligne
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);

  const itemsPerPage = 20;
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap);
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Mettez également à jour `filteredInfos` ici
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setFilteredInfos(
      infos.filter(info =>
        info.name.toLowerCase().includes(value) ||
        info.pays.toLowerCase().includes(value) ||
        info.secteur.toLowerCase().includes(value) ||
        info.industrie.toLowerCase().includes(value)
      )
    );
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);

    // Appliquer les filtres
    let filteredData = infos;

    newFilters.forEach(filter => {
      if (filter.filterType && filter.selectedOption) {
        filteredData = filteredData.filter(info =>
          info[filter.filterType] === filter.selectedOption
        );
      }

      if (filter.min) {
        filteredData = filteredData.filter(info =>
          parseFloat(info[filter.filterType]) >= parseFloat(filter.min)
        );
      }

      if (filter.max) {
        filteredData = filteredData.filter(info =>
          parseFloat(info[filter.filterType]) <= parseFloat(filter.max)
        );
      }
    });

    setFilteredInfos(filteredData);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredDataForCurrentPage = filteredInfos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={query}
        onChange={handleSearch}
      />
      <Button onClick={() => setShowModal(true)}>Filtres</Button>

      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredDataForCurrentPage.map((info, index) => (
            <tr key={index}>
              <td>{info.name}</td>
              <td>{info.pays}</td>
              <td>{info.secteur}</td>
              <td>{info.industrie}</td>
              <td>{formatNumber(info.marketcap)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Précédent
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= filteredInfos.length}>
          Suivant
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filters.map((filter, index) => (
            <div key={index}>
              <select
                value={filter.filterType}
                onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
              >
                <option value="">Choisir un filtre</option>
                <option value="pays">Pays</option>
                <option value="secteur">Secteur</option>
                <option value="industrie">Industrie</option>
                <option value="marketcap">Market Cap</option>
              </select>
              <select
                value={filter.selectedOption}
                onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
              >
                {/* Options dynamiques basées sur le filtre sélectionné */}
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
