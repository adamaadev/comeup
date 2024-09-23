import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [countryMapping, setCountryMapping] = useState({});
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    fetchCountryNames();
    fetchRandomCompanies();
  }, [page]);

  const fetchCountryNames = async () => {
    try {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      const mapping = {};
      res.data.forEach(country => {
        const code = country.cca2;
        const name = country.name.common;
        mapping[code] = name;
      });
      setCountryMapping(mapping);
    } catch (error) {
      console.error('Error fetching country names:', error);
    }
  };

  const fetchRandomCompanies = () => {
    axios.get(`http://localhost:4000/listcompany/random?page=${page}&limit=10`)
      .then(res => {
        setInfos(res.data.data);
        setFilteredInfos(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch(error => console.error('Error fetching companies:', error));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    axios.get(`http://localhost:4000/search?query=${value}`)
      .then(res => {
        setFilteredInfos(res.data);
      })
      .catch(error => console.error('Error searching companies:', error));
  };

  const formatNumber = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(3) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(3) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(4) + 'K';
    }
    return num;
  };

  const getFullCountryName = (code) => {
    return countryMapping[code] || code;
  };

  const calculateCAGR = async (symbol) => {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear - 5}-12-31`;
    const endDate = `${currentYear - 1}-12-31`;

    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${startDate}&to=${endDate}&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      const historicalData = response.data.historical;

      if (historicalData?.length >= 2) {
        const initialValue = historicalData[historicalData.length - 1]?.close;
        const finalValue = historicalData[0]?.close;
        const years = historicalData.length - 1;
        const cagrValue = ((finalValue / initialValue) ** (1 / years) - 1) * 100;
        return cagrValue.toFixed(2) + '%';
      } else {
        return 'Données insuffisantes';
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return 'Erreur de chargement';
    }
  };

  useEffect(() => {
    const fetchPerformances = async () => {
      const performanceMap = {};
      for (const company of filteredInfos) {
        const symbol = company.symbol;
        const performance = await calculateCAGR(symbol);
        performanceMap[symbol] = performance;
      }
      setPerformanceData(performanceMap);
    };

    fetchPerformances();
  }, [filteredInfos]);

  return (
    <div className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Screener</h2>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher sur la liste"
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Symbol</th>
              <th>Secteur</th>
              <th>Capitalisation</th>
              <th>Pays</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredInfos.map((company, index) => (
              <tr key={company.id} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td>{index + 1}</td>
                <td><img src={company.logo} alt={company.nom} style={{ maxWidth: '50px', height: 'auto' }} /></td>
                <td>{company.nom}</td>
                <td>{company.symbol}</td>
                <td>{company.secteur}</td>
                <td>{formatNumber(company.capitalisation)}</td>
                <td>{getFullCountryName(company.pays)}</td>
                <td>{performanceData[company.symbol]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}>
          Précédent
        </button>
        <span>Page {page} sur {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
}
