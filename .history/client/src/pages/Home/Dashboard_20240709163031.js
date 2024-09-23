import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [id, setId] = useState();
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => setId(res.data.id))
      .catch(err => console.error('Error fetching user ID:', err));
    
    axios.get('http://localhost:4000/list')
      .then(res => {
        console.log(res.data); // Vérifiez la structure de données reçue
        setWatchlist(res.data);
      })
      .catch(err => console.error('Error fetching watchlist:', err));
  }, []);

  return (
    <section className="container mt-4">
      <h2 className="mb-4">Watchlist Bourse Impact</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Rechercher sur la liste"
      />
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
            {watchlist.map((item, index) => (
              <tr key={index} onClick={()=> navigate(`/details/${item.screenerData.symbol}`)}>
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
        <a className='btn btn-success' href="mailto:">Email</a>
      </div>
    </section>
  );
}
