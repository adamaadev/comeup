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
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  const ratioNames = {
    'exchangeShortName': 'Exchange',
    'pays': 'Pays',
    'secteur': 'Secteur',
    'industrie': 'Industrie',
    'buyback_yield': 'Buyback yield',
    'croissance_CA_1_an': 'CA 1 an (%)',
    'croissance_CA_5_ans': 'CA 5 ans (%)',
    'croissance_CA_10_ans': 'CA 10 ans (%)',
    'fcf_1_year': 'FCF 1 an',
    'fcf_5_years': 'FCF 5 ans',
    'fcf_10_years': 'FCF 10 ans',
    'fcf_margin_one_year': 'FCF Margin 1 an',
    'fcf_margin_five_year': 'FCF Margin 5 ans',
    'roce': 'ROCE 1 an',
    'roce_5_year_avg': 'ROCE Moyenne 5 ans',
    'croissance_resultat_net_1_an': 'Résultat Net 1 an',
    'croissance_resultat_net_5_ans': 'Résultat Net 5 ans',
    'piotroski_score': 'Piotroski-Score',
    'ratio_capex_revenu_net': 'Ratio CAPEX/Revenu Net',
    'rachat_net_moyen': 'Rachat Net Moyen',
    'croissance_annualisee': 'Croissance Annualisée',
    'croissance_moyenne': 'Croissance Moyenne',
    'debt_equity': 'Debt-Equity',
    'ratio_payout': 'Payout-Ratio',
    'performance': 'Performance 5 ans',
    'nbreannee': 'Nombre d\'années',
    'quanti': 'Quanti-score',
    'Pea': 'Pea',
    'Dividende': 'Dividende'
  };

  const handleCloseModal = () => setShowModal(false);

  const getAvailableRatioOptions = (currentFilterIndex) => {
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);

    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation);
        setInfos(sortedData);
        setFilteredInfos(sortedData);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des données:', err);
      });
  }, []);

  useEffect(() => {
    const initialColumns = ['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation', 'exchangeShortName', 'Pea', 'Dividende'];
    const newColumns = [
      ...initialColumns.filter(col => col !== 'exchangeShortName'),
      ...filters
        .map(f => f.filterType)
        .filter(f => f && !initialColumns.includes(f))
    ];
    setColumns(newColumns);
  }, [filters]);

  useEffect(() => {
    const applyFilters = () => {
      if (!query && filters.length === 0) {
        const sortedByMarketCap = infos.slice().sort((a, b) => {
          const marketCapA = parseFloat(a.Capitalisation) || 0;
          const marketCapB = parseFloat(b.Capitalisation) || 0;
          return marketCapB - marketCapA;
        });

        return sortedByMarketCap;
      }

      const filtered = infos.filter(info => {
        const matchesQuery = query
          ? info.symbol.toLowerCase().includes(query.toLowerCase()) ||
            info.Nom.toLowerCase().includes(query.toLowerCase())
          : true;

        const matchesFilters = filters.every(({ filterType, selectedOption, min, max }) => {
          if (!filterType) return true;

          if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee', 'quanti'].includes(filterType)) {
            const value = parseFloat(info[filterType]);

            if (isNaN(value)) return true;

            const minValue = min ? parseFloat(min) : null;
            const maxValue = max ? parseFloat(max) : null;

            if (minValue !== null && value < minValue) return false;
            if (maxValue !== null && value > maxValue) return false;

            return true;
          }

          if (selectedOption) {
            return info[filterType] === selectedOption;
          }

          return true;
        });

        return matchesQuery && matchesFilters;
      });

      const uniqueResults = new Map();
      filtered.forEach(info => {
        const key = query.toLowerCase();
        if (info.symbol.toLowerCase().includes(key) || info.Nom.toLowerCase().includes(key)) {
          if (!uniqueResults.has(info.Nom)) {
            uniqueResults.set(info.Nom, info);
          }
        }
      });

      const uniqueFiltered = Array.from(uniqueResults.values());

      const sortedFiltered = uniqueFiltered.sort((a, b) => {
        const marketCapA = parseFloat(a.Capitalisation) || 0;
        const marketCapB = parseFloat(b.Capitalisation) || 0;
        return marketCapB - marketCapA;
      });

      return sortedFiltered;
    };

    const filteredInfos = applyFilters();
    setFilteredInfos(filteredInfos);
  }, [filters, query, infos]);

  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    setSecondSelectChanged(true);
  };

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery === '') {
      setFilteredInfos(infos);
    } else {
      setSecondSelectChanged(true);
    }
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
    if (filters.length < 27) {
      setFilters([...filters, { filterType: '', selectedOption: '', min: '', max: '' }]);
    }
  };

  const getFilterOptions = (filterType) => {
    if (!filterType) return [];
    if (filterType === 'Pea') return ['Oui', 'Non'];
    if (['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee', 'quanti'].includes(filterType)) return [];
    return [...new Set(infos.map(info => info[filterType]))];
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Rechercher..."
        />
        <button onClick={() => setShowModal(true)}>Filtrer</button>
      </div>

      {filters.map((filter, index) => (
        <div key={index}>
          <select
            value={filter.filterType}
            onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
          >
            <option value="">Choisir un filtre</option>
            {getAvailableRatioOptions(index).map(option => (
              <option key={option} value={option}>
                {ratioNames[option] || option}
              </option>
            ))}
          </select>
          {filter.filterType && (
            <>
              {getFilterOptions(filter.filterType).length > 0 && (
                <select
                  value={filter.selectedOption}
                  onChange={(e) => handleFilterChange(index, 'selectedOption', e.target.value)}
                >
                  <option value="">Sélectionner...</option>
                  {getFilterOptions(filter.filterType).map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {['buyback_yield', 'fcf_1_year', 'fcf_5_years', 'fcf_10_years', 'fcf_margin_one_year', 'fcf_margin_five_year', 'roce', 'roce_5_year_avg', 'croissance_resultat_net_1_an', 'croissance_resultat_net_5_ans', 'croissance_CA_1_an', 'croissance_CA_5_ans', 'croissance_CA_10_ans', 'croissance_annualisee', 'croissance_moyenne', 'debt_equity', 'ratio_payout', 'performance', 'nbreannee', 'quanti'].includes(filter.filterType) && (
                <>
                  <input
                    type="number"
                    value={filter.min}
                    onChange={(e) => handleFilterChange(index, 'min', e.target.value)}
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filter.max}
                    onChange={(e) => handleFilterChange(index, 'max', e.target.value)}
                    placeholder="Max"
                  />
                </>
              )}
              <button onClick={() => removeFilter(index)}>Supprimer le filtre</button>
            </>
          )}
        </div>
      ))}
      <button onClick={addFilter}>Ajouter un filtre</button>

      {filteredInfos.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map(col => <th key={col}>{ratioNames[col] || col}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredInfos
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((info, index) => (
                <tr key={index}>
                  {columns.map(col => (
                    <td key={col}>
                      {info[col] !== undefined ? info[col] : '-'}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      )}

      <div>
        {[...Array(Math.ceil(filteredInfos.length / itemsPerPage)).keys()].map(page => (
          <button key={page} onClick={() => handlePageChange(page + 1)}>
            {page + 1}
          </button>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtrer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Vous pouvez mettre ici les options de filtre supplémentaires */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Appliquer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
