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
            <option value="marketcap">Market Cap</option>
            <option value="croissance_CA_1_an">Croissance CA 1 an</option>
            <option value="croissance_CA_5_ans">Croissance CA 5 ans</option>
            <option value="croissance_CA_10_ans">Croissance CA 10 ans</option>
            <option value="fcf_1_year">FCF 1 an</option>
            <option value="fcf_5_years">FCF 5 ans</option>
            <option value="fcf_10_years">FCF 10 ans</option>
            <option value="fcf_margin_one_year">Marge FCF 1 an</option>
            <option value="fcf_margin_five_year">Marge FCF 5 ans</option>
            <option value="roce">RoCE</option>
            <option value="roce_5_year_avg">RoCE Moyenne 5 ans</option>
            <option value="croissance_resultat_net_1_an">Croissance Résultat Net 1 an</option>
            <option value="croissance_resultat_net_5_ans">Croissance Résultat Net 5 ans</option>
            <option value="piotroski_score">Score Piotroski</option>
            <option value="ratio_capex_revenu_net">Ratio Capex / Revenu Net</option>
            <option value="rachat_net_moyen">Rachat Net Moyen</option>
            <option value="croissance_annualisee">Croissance Annualisée</option>
            <option value="croissance_moyenne">Croissance Moyenne</option>
            <option value="debt_equity">Ratio Dette / Capitaux Propres</option>
            <option value="ratio_payout">Ratio de Distribution</option>
            <option value="performance">Performance</option>
            <option value="stabilite_nbreannee">Stabilité Nombre d’Années</option>
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
            <option value="">Aucun filtre</option>
            <option value="pays">Pays</option>
            <option value="secteur">Secteur</option>
            <option value="eligiblePea">Eligible PEA</option>
            <option value="verseDividende">Verse Dividende</option>
          </select>
        </div>
        {filterType && (
          <div className="col-md-6">
            <label htmlFor="filter_value_select">Valeur du filtre :</label>
            <select id="filter_value_select" className="form-control" value={filterValue} onChange={handleFilterValueChange}>
              <option value="">Sélectionnez une valeur</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Pays</th>
            <th>Secteur - Industrie</th>
            <th>Capitalisation</th>
            <th width={200}>Eligible PEA</th>
            <th width={200}>Verse Dividende</th>
          </tr>
        </thead>
        <tbody>
          {infos.map((company) => (
            <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
              <td className="d-flex align-items-center">
                <img
                  src={company.logo}
                  alt={`${company.Name} logo`}
                  width="50"
                  height="50"
                  style={{ display: 'block', marginRight: '10px' }}
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
