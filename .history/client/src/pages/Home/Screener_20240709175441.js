import axios from 'axios';
import { useState, useEffect } from 'react';

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
    <div className="container">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
        />
      </div>
      <div className="company-list">
        {infos.map(company => (
          <div key={company.id} className="company-item">
            <img src={company.logo} alt={company.nom} width="50" />
            <div>{company.nom}</div>
            <div>{company.symbol}</div>
            <div>{company.pays}</div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Précédent</button>
        <span>Page {page} sur {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Suivant</button>
      </div>
    </div>
  );
}
