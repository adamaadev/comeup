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
  const [localFilters, setLocalFilters] = useState(filters);
  const [filteredInfos, setFilteredInfos] = useState([]);

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

  useEffect(() => {
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
  }, [filters, query, infos]);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const handleFilterChange = (index, field, value) => {
    const newLocalFilters = [...localFilters];
    newLocalFilters[index][field] = value;

    if (field === 'filterType') {
      // Reset selected option, min, and max when the filter type changes
      newLocalFilters[index].selectedOption = '';
      newLocalFilters[index].min = '';
      newLocalFilters[index].max = '';
    }

    setLocalFilters(newLocalFilters);
  };

  const handleSecondSelectChange = (index, value) => {
    const newLocalFilters = [...localFilters];
    newLocalFilters[index].selectedOption = value;
    setLocalFilters(newLocalFilters);
    applyFilters(newLocalFilters);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    handleCloseModal();
  };

  const addFilter = () => {
    setLocalFilters([...localFilters, { filterType: '', selectedOption: '', min: '', max: '' }]);
  };

  const removeFilter = (index) => {
    const newLocalFilters = localFilters.filter((_, i) => i !== index);
    setLocalFilters(newLocalFilters);
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

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
  };

  return (
  );
}
