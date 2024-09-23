import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [query, setQuery] = useState('');
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
      axios.post('http://localhost:4000/listforuser', { id })
        .then(res => {
          setInfos(res.data);
          setFilteredInfos(res.data); // Initialize filteredInfos with all infos
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
      <div className="d-flex align-items-center mb-4">
        <h2 className="mr-3">Ma watchlist</h2>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Rechercher sur la liste" 
          value={query}
          onChange={handleInputChange}
          style={{ width: '300px' , marginLeft:'49rem'}}
        />
      </div>
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
            {filteredInfos.map((item, index) => (
              <tr key={index} onClick={() => window.open(`/details/${item.screenerData.symbol}`, '_blank')}>
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
