import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const fetchCompanies = (page) => {
    axios.get(`http://localhost:4000/listcompany?page=${page}&limit=10`)
      .then(res => {
        setInfos(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <div className="form-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
        />
      </div>
      <div className="row">
        {infos.map(company => (
          <div key={company.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={company.logo} className="card-img-top" alt={company.nom} />
              <div className="card-body">
                <h5 className="card-title">{company.nom}</h5>
                <p className="card-text"><strong>Symbole:</strong> {company.symbol}</p>
                <p className="card-text"><strong>Pays:</strong> {company.pays}</p>
              </div>
            </div>
          </div>
        ))}
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
