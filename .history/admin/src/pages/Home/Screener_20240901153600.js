import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'marketcap']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  const handleCloseModal = () => setShowModal(false);

  // Charger les données et trier par marketcap de manière décroissante
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketcap - a.marketcap); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  useEffect(() => {
    // Définir les colonnes fixes initiales
    const initialColumns = ['Name', 'pays', 'secteur', 'industrie', 'marketcap', 'chiffre_affaire'];
    
    // Ajouter les colonnes des filtres qui ne sont pas déjà présentes
    const newColumns = [
      ...initialColumns,
      ...filters
        .map(f => f.filterType)
        .filter(f => f && !initialColumns.includes(f))
    ];
    
    setColumns(newColumns);
  }, [filters]);

  useEffect(() => {
    // Fonction de filtrage
    const applyFilters = () => {
      return infos.filter(info => {
        const matchesQuery = 
          info.Name.toLowerCase().includes(query.toLowerCase()) || 
          info.symbol.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true;

          if (filterType === 'eligiblePea') return (info[filterType] ? 'Oui' : 'Non') === selectedOption;

          if (['buyback_yield', 'chiffre_affaire', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filterType)) {
            const value = parseFloat(info[filterType]);
            if (min && value < parseFloat(min)) return false;
            if (max && value > parseFloat(max)) return false;
            return true;
          }

          return info[filterType] === selectedOption;
        });

        return matchesQuery && matchesFilters;
      });
    };

    // Appliquer le filtrage et le tri uniquement si le second sélecteur a été modifié
    if (secondSelectChanged) {
      const filtered = applyFilters();
      // Tri des résultats filtrés par marketcap de manière décroissante
      const sortedFiltered = filtered.sort((a, b) => b.marketcap - a.marketcap);
      setFilteredInfos(sortedFiltered);
      setSecondSelectChanged(false);
    } else {
      // Mettre à jour les infos filtrées en fonction de la barre de recherche uniquement
      setFilteredInfos(prevFilteredInfos => prevFilteredInfos.filter(info => 
        info.Name.toLowerCase().includes(query.toLowerCase()) || 
        info.symbol.toLowerCase().includes(query.toLowerCase())
      ));
    }
  }, [filters, secondSelectChanged, query, infos]);

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
    if (['buyback_yield', 'chiffre_affaire', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filterType)) {
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
                  <option value="chiffre_affaire">Chiffre d'affaire</option>
                  <option value="croissance_annualisee">Croissance Annualisée</option>
                  <option value="croissance_moyenne">Croissance Moyenne</option>
                  <option value="croissance_resultat_net_1_an">Croissance Résultat Net 1 an</option>
                  <option value="croissance_resultat_net_5_ans">Croissance Résultat Net 5 ans</option>
                </select>
              </div>

              {filter.filterType === 'buyback_yield' || ['chiffre_affaire', 'croissance_annualisee', 'croissance_moyenne', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans'].includes(filter.filterType) ? (
                <>
                  <div className="col-md-4">
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Min %" 
                      value={filter.min} 
                      onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
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
                <div className="col-md-4">
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
              <div className="col-md-12 mt-2">
                <button className="btn btn-danger" onClick={() => removeFilter(index)}>Supprimer</button>
              </div>
            </div>
          ))}
          <Button variant="primary" onClick={addFilter}>Ajouter un filtre</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
        </Modal.Footer>
      </Modal>
      <table className="table table-bordered">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col === 'chiffre_affaire' ? 'Chiffre d\'affaire' : col}</th>
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
              <td>{formatNumber(info.marketcap)} milliards</td>
              <td>{formatNumber(info.chiffre_affaire)}</td>
              {/* Affichez d'autres informations comme nécessaire */}
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePrevPage}>Précédent</button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleNextPage}>Suivant</button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
