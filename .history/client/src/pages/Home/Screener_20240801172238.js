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

  // URL du logo par défaut de Financial Modeling Prep
  const defaultLogoUrl = 'https://financialmodelingprep.com/image-stock/default.png';

  // Fonction pour obtenir le logo depuis l'API Financial Modeling Prep
  const getLogoUrl = async (symbol) => {
    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      return response.data[0]?.image || defaultLogoUrl; // Retourne le logo ou le logo par défaut
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return defaultLogoUrl;
    }
  };

  // Fonction pour gérer les erreurs des images
  const handleError = async (e, symbol) => {
    const logoUrl = await getLogoUrl(symbol); // Obtient le logo depuis Financial Modeling Prep
    e.target.src = logoUrl; // Met à jour l'image avec le nouveau logo
    e.target.onerror = () => { e.target.src = defaultLogoUrl; }; // Gestion des erreurs pour le nouveau logo
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
              <th>Nom</th>
              <th>Pays</th>
              <th>Industrie</th>
              <th>Capitalisation</th>
              <th>PEA</th>
              <th>Dividende</th>
            </tr>
          </thead>
          <tbody>
            {filteredInfos.map((company) => (
              <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td className="d-flex align-items-center">
                  <img
                    src={company.logo}
                    alt={`${company.Name} logo`}
                    width="50"
                    height="50"
                    onError={(e) => handleError(e, company.symbol)} // Appelle handleError en cas d'erreur
                    style={{ display: 'block', marginRight: '10px' }}
                  />
                  <div>
                    <div>{company.Name}</div>
                    <div>{company.symbol}</div>
                  </div>
                </td>
                <td>{company.pays}</td>
                <td>{company.secteur} / {company.industrie}</td>
                <td>{company.marketCap}</td>
                <td>{company.eligiblePea ? 'v' : 'x'}</td>
                <td>{company.VerseDividende ? 'v' : 'x'}</td>
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
