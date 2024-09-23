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
          placeholder="Rechercher sur la liste"
        />
      </div>
  </div>
  
  );
}
