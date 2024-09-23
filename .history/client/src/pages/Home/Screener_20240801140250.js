import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchRandomCompanies();
  }, [page]);

  const fetchRandomCompanies = () => {
    axios.get(`http://localhost:4000/listcompany?page=${page}&limit=10`)
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
    return (num / 1e9).toFixed(3) + ' milliard';
  };

  // Gestionnaire d'erreur pour les images de logo
  const handleError = (e) => {
    e.target.src = 'path/to/placeholder-image.png'; // Remplacez par le chemin de votre image de remplacement
    e.target.alt = 'Logo indisponible';
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
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th></th>
              <th>Nom</th>
              <th>Logo</th>
              <th>Symbol</th>
              <th>Pays</th>
              <th>Secteur</th>
              <th>Industrie</th>
              <th>Capitalisation</th>
              <th>Eligible PEA</th>
              <th>Verse Dividende</th>
            </tr>
          </thead>
          <tbody>
            {filteredInfos.map((company, index) => (
              <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td>{index + 1}</td>
                <td>{company.Name}</td>
                <td>
                  <img
                    src={company.logo}
                    alt={`${company.Name} logo`}
                    width="50"
                    height="50"
                    onError={handleError}
                  />
                </td>
                <td>{company.symbol}</td>
                <td>{company.pays}</td>
                <td>{company.secteur}</td>
                <td>{company.industrie}</td>
                <td>{formatNumber(company.marketCap)}</td>
                <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                <td>{company.VerseDividende ? 'Oui' : 'Non'}</td>
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
