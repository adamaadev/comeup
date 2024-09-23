import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  
  useEffect(() => {
    axios.get('http://localhost:4000')
      .then(res => {
        setId(res.data.id);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/list', { id })
        .then(res => {
          setInfos(res.data);
          console.log(res.data);
        });
    }
  }, [id]);

  return (
    <section className="container mt-4">
      <h2>Ma watchlist</h2>
      <input type="text" className="form-control" placeholder="Rechercher sur la liste" />
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Symbole</th>
              <th scope="col">Image</th>
              <th scope="col">Secteur</th>
              <th scope="col">Capitalisation</th>
              <th scope="col">Pays</th>
            </tr>
          </thead>
          <tbody>
            {infos.map((item, index) => (
              <tr key={index}>
                <td>{item.screenerData.nom}</td>
                <td>{item.screenerData.symbol}</td>
                <td><img src={item.screenerData.logo} alt={item.screenerData.nom} style={{ width: '50px' }} /></td>
                <td>{item.screenerData.secteur}</td>
                <td>{item.screenerData.capitalisation}</td>
                <td>{item.screenerData.pays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
