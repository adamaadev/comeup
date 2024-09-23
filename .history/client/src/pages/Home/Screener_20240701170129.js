import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Screener() {
  const [symbol, setSymbol] = useState('');
  const [infos, setInfos] = useState(null);
  const [id, setid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000')
      .then(res => {
        setid(res.data.id);
      })
      .catch(err => console.error('Erreur lors de la récupération du nom d\'utilisateur :', err));
  }, []);

  return (
    <div className="container">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          placeholder="Rechercher sur la liste"
        />
      </div>
    <section>
      {isLoading && <p className="text-info">Chargement en cours...</p>}
      {error && <p className="text-danger">{error}</p>}
      {infos && (
        <main className="card p-3">
          <Link to={`/details/${symbol}`} className="btn btn-link mb-3">En savoir plus</Link>
          <h2>Nom : {infos.companyName}</h2>
          <p><strong>Symbol:</strong> {infos.symbol}</p>
          <p><strong>CEO:</strong> {infos.ceo}</p>
          <p><strong>Industry:</strong> {infos.industry}</p>
          <img src={infos.image} alt={`${infos.companyName} logo`} className="img-fluid" />
        </main>
      )}
    </section>
  </div>
  
  );
}
