import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Watchlist() {
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [query, setQuery] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000')
      .then(res => {
        setId(res.data.id);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/listforuser', { id })
        .then(res => {
          setInfos(res.data);
          setFilteredInfos(res.data);
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = infos.filter(info => 
      info.screenerData.nom.toLowerCase().includes(value.toLowerCase()) ||
      info.screenerData.symbol.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInfos(filtered);
  };

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Ma watchlist</h2>
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
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Symbole</th>
              <th scope="col">Logo</th>
              <th scope="col">Secteur</th>
              <th scope="col">Capitalisation</th>
              <th scope="col">Pays</th>
            </tr>
          </thead>
          <tbody>
            {filteredInfos.map((item, index) => (
              <tr key={index} onClick={() => window.open(`/details/${item.screenerData.symbol}`, '_blank')}>
                <td>{item.screenerData.nom}</td>
                <td>{item.screenerData.symbol}</td>
                <td><img src={item.screenerData.logo} alt={item.screenerData.nom} style={{ maxWidth: '50px', height: 'auto' }} /></td>
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
