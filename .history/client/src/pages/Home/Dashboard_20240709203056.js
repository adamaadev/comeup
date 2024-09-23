import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [id, setId] = useState();
  const [watchlist, setWatchlist] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => setId(res.data.id))
    
    axios.get('http://localhost:4000/list')
      .then(res => {
        setWatchlist(res.data);
        setFilteredWatchlist(res.data); 
      })
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = watchlist.filter(item => 
      item.screenerData.nom.toLowerCase().includes(value.toLowerCase()) ||
      item.screenerData.symbol.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredWatchlist(filtered);
  };

  return (
    <section className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mr-3">Watchlist Bourse Impact</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
          value={query}
          onChange={handleInputChange}
          style={{ width: '250px' , marginLeft:'39rem'}}
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
            {filteredWatchlist.map((item, index) => (
              <tr key={index} onClick={() => window.open(`/details/${item.screenerData.symbol}`, '_blank')}>
                <td>{index + 1}</td>
                <td><img src={item.screenerData.logo} alt={item.screenerData.nom} style={{ width: '50px' }} /></td>
                <td>{item.screenerData.nom}</td>
                <td>{item.screenerData.symbol}</td>
                <td>{item.screenerData.secteur}</td>
                <td>{item.screenerData.capitalisation}</td>
                <td>{item.screenerData.pays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <a className="btn btn-success" href="mailto:">Email</a>
      </div>
    </section>
  );
}
