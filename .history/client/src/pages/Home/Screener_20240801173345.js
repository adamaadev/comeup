import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    axios.get('http://localhost:4000/listcompany?limit=10000') // Charger toutes les entreprises
      .then(res => {
        const allCompanies = res.data.data;
        setInfos(allCompanies);
        filterUnavailableLogos(allCompanies);
      })
      .catch(error => console.error('Error fetching companies:', error))
      .finally(() => setLoading(false));
  };

  const filterUnavailableLogos = (companies) => {
    const filtered = companies.filter(company => !company.logo || !company.logo.startsWith('http'));
    setFilteredInfos(filtered);
  };

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3) + ' milliard';
  };

  // Gestionnaire d'erreur pour les images de logo
  const handleError = (e) => {
    e.target.style.display = 'none'; // Masque l'image
    const textElement = document.createElement('span');
    textElement.textContent = 'Logo indisponible';
    textElement.style.color = 'red';
    textElement.style.fontSize = '12px';
    textElement.style.fontStyle = 'italic';
    e.target.parentNode.appendChild(textElement); // Ajoute le texte à la cellule
  };

  return (
    <div className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Screener</h2>
        </div>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Nom</th>
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
                  <td className="d-flex align-items-center">
                    <img
                      src={company.logo}
                      alt={`${company.Name} logo`}
                      width="50"
                      height="50"
                      onError={handleError}
                      style={{ display: 'block', marginRight: '10px' }}
                    />
                    <div>
                      <div>{company.Name}</div>
                      <div>{company.symbol}</div>
                    </div>
                  </td>
                  <td>{company.pays}</td>
                  <td>{company.secteur} / {company.industrie}</td>
                  <td>{formatNumber(company.marketCap)}</td>
                  <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                  <td>{company.VerseDividende ? 'Oui' : 'Non'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
