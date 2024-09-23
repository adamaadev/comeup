import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Remplacez par votre clé API pour FinancialGrep
const FINANCIALGREP_API_KEY = 'your-api-key-here'; 

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');

  const logoProviders = [
    (symbol) => `https://financialgrep.com/api/v1/logos/${symbol}`,
    // Ajoutez ici d'autres fournisseurs de logos si nécessaire
  ];

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

  const handleError = async (e) => {
    const companySymbol = e.target.getAttribute('data-symbol');
    e.target.style.display = 'none'; // Masquer l'image invalide

    const logoElement = document.createElement('span');
    logoElement.textContent = 'Logo indisponible';
    logoElement.style.color = 'red';
    logoElement.style.fontSize = '12px';
    logoElement.style.fontStyle = 'italic';
    e.target.parentNode.appendChild(logoElement); // Ajouter le texte "Logo indisponible"

    try {
      // Essayez de récupérer le logo depuis FinancialGrep
      const res = await axios.get(`https://financialgrep.com/api/v1/logos/${companySymbol}`, {
        headers: {
          'Authorization': `Bearer ${FINANCIALGREP_API_KEY}`
        }
      });
      if (res.status === 200 && res.data.logoUrl) {
        e.target.src = res.data.logoUrl;
      } else {
        // Affichez "Logo indisponible" si le logo n'est pas trouvé
        logoElement.textContent = 'Logo indisponible';
      }
    } catch (error) {
      // En cas d'erreur avec FinancialGrep, afficher "Logo indisponible"
      console.error('Error fetching logo from FinancialGrep:', error);
      logoElement.textContent = 'Logo indisponible';
    }
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
                    data-symbol={company.symbol} // Ajouter un attribut pour récupérer le symbole
                    onError={handleError}
                  />
                </td>
                <td>{company.symbol}</td>
                <td>{company.pays}</td>
                <td>
                  {company.secteur} / {company.industrie}
                </td>
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
