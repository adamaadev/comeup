import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [sectors, setSectors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryMapping, setCountryMapping] = useState({});

  useEffect(() => {
    fetchCountryNames();
    fetchCompanies();
    fetchSectorsAndCountries();
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

  const fetchCompanies = () => {
    axios.get(`http://localhost:4000/listcompany?page=${page}&limit=10`)
      .then(res => {
        setInfos(res.data.data);
        setFilteredInfos(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch(error => console.error('Error fetching companies:', error));
  };

  const fetchSectorsAndCountries = () => {
    axios.get('http://localhost:4000/getFilters')
      .then(res => {
        setSectors(res.data.sectors);
        setCountries(res.data.countries);
      })
      .catch(error => console.error('Error fetching filters:', error));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    filterData(value, selectedSector, selectedCountry);
  };

  const handleSectorChange = (e) => {
    const value = e.target.value;
    setSelectedSector(value);
    filterData(query, value, selectedCountry);
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setSelectedCountry(value);
    filterData(query, selectedSector, value);
  };

  const filterData = (query, sector, country) => {
    let filtered = infos;

    if (query) {
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sector) {
      filtered = filtered.filter(company => company.sector === sector);
    }

    if (country) {
      filtered = filtered.filter(company => company.country === country);
    }

    setFilteredInfos(filtered);
  };

  const formatNumber = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(3) + ' B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(3) + ' M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(3) + ' K';
    }
    return num;
  };

  const getFullCountryName = (code) => {
    return countryMapping[code] || code;
  };

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
      <div className="row mb-4">
        <div className="col-md-6">
          <select
            className="form-control"
            value={selectedSector}
            onChange={handleSectorChange}
          >
            <option value="">Secteur</option>
            {sectors.map((sector, index) => (
              <option key={index} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select
            className="form-control"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Symbol</th>
              <th>Secteur</th>
              <th>Capitalisation</th>
              <th>Pays</th>
            </tr>
          </thead>
          <tbody style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredInfos.map((company, index) => (
              <tr key={company.id} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td>{index + 1}</td>
                <td>{company.companyName}</td>
                <td>{company.symbol}</td>
                <td>{company.sector}</td>
                <td>{formatNumber(company.mktCap)}</td>
                <td>{getFullCountryName(company.country)}</td>
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
