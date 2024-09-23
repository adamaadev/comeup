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

  // Le reste de votre code...
