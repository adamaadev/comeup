import axios from 'axios';
import { useState, useEffect } from 'react';
export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [ratio, setRatio] = useState('marketcap'); // Default sorting column
  const [sortOrder, setSortOrder] = useState('ASC'); // Default sorting order
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, [page, ratio, sortOrder, filterType, filterValue]);

  const fetchCompanies = () => {
    const url = `http://localhost:4000/screener?page=${page}&limit=20&sortBy=${ratio}&sortOrder=${sortOrder}&filterType=${filterType}&filterValue=${filterValue}&query=${query}`;

    axios.get(url)
      .then(res => {
        setInfos(res.data.data);
        setTotalPages(res.data.totalPages);
      });
  };

  const fetchFilterOptions = (type) => {
    axios.get(`http://localhost:4000/filter-options?filterType=${type}`)
      .then(res => setFilterOptions(res.data))
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchCompanies(); // Call fetchCompanies directly to filter results based on query
  };

  const handleRatioChange = (e) => {
    setRatio(e.target.value);
    setSortOrder('ASC'); // Reset sort order to ascending when ratio changes
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    const selectedFilterType = e.target.value;
    setFilterType(selectedFilterType);
    setFilterValue(''); // Reset filter value when type changes
    setFilterOptions([]); // Reset filter options when type changes
    if (selectedFilterType) {
      fetchFilterOptions(selectedFilterType);
    }
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const formatNumber = (num) => (num / 1e9).toFixed(3);

  return (
    <div className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-4">
          <h2 className="mb-0">Screener</h2>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher"
            value={query}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="ratio_select">Choisissez un Ratio :</label>
          <select id="ratio_select" className="form-control" value={ratio} onChange={handleRatioChange}>
            {/* Ratio options */}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="order_select">Choisissez un Ordre :</label>
          <select id="order_select" className="form-control" value={sortOrder} onChange={handleOrderChange}>
            <option value="ASC">Croissant</option>
            <option value="DESC">Décroissant</option>
          </select>
        </div>
      </div>
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <label htmlFor="filter_type_select">Filtrer par :</label>
          <select id="filter_type_select" className="form-control" value={filterType} onChange={handleFilterTypeChange}>
            {/* Filter type options */}
          </select>
        </div>
        {filterType && (
          <div className="col-md-6">
            <label htmlFor="filter_value_select">Valeur du filtre :</label>
            <select id="filter_value_select" className="form-control" value={filterValue} onChange={handleFilterValueChange}>
              {/* Filter value options */}
            </select>
          </div>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Nom</th>
              <th>Pays</th>
              <th>Secteur - Industrie</th>
              <th>Capitalisation</th>
              <th>Eligible PEA</th>
              <th>Verse Dividende</th>
            </tr>
          </thead>
          <tbody>
            {infos.map((company) => (
              <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td className="d-flex align-items-center">
                  <img
                    src={company.logo}
                    alt={`${company.Name} logo`}
                    className="company-logo"
                  />
                  <div>
                    <div>{company.Name}</div>
                    <div>{company.symbol}</div>
                  </div>
                </td>
                <td>{company.pays}</td>
                <td>{company.secteur} - {company.industrie}</td>
                <td>{formatNumber(company.marketcap)}</td>
                <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                <td>{company.verseDividende ? 'Oui' : 'Non'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span>Page {page} sur {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
