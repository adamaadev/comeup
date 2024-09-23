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
    fetchCompanies(page);
  }, [page]);

  const fetchCompanies = (page) => {
    axios.get(`http://localhost:4000/listcompany?page=${page}&limit=10`)
      .then(res => {
        setInfos(res.data.data);
        setFilteredInfos(res.data.data); // Initialize filteredInfos with all fetched data
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Appel de l'endpoint de recherche avec Axios
    axios.get(`http://localhost:4000/search?query=${value}`)
      .then(res => {
        setFilteredInfos(res.data);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mr-3">Screener</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
          value={query}
          onChange={handleInputChange}
          style={{ width: '300px' }}
        />
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
            </tr>
          </thead>
          <tbody>
            {infos.map((company, index) => (
              <tr key={company.id} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td>{(page - 1) * 10 + index + 1}</td>
                <td><img src={company.logo} alt={company.nom} style={{ width: '50px' }} /></td>
                <td>{company.nom}</td>
                <td>{company.symbol}</td>
                <td>{company.secteur}</td>
                <td>{company.capitalisation}</td>
                <td>{company.pays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
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
