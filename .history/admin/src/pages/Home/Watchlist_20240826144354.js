import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function Watchlist() {
  const type = "admin";
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setId(res.data.id);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/watchlist', { id, type })
        .then(res => {
          setInfos(res.data);
        });
    }
  }, [id]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const filteredInfos = infos.filter(info => 
    info.Name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Ma watchlist</h2>
        </div>
        <div className="col-md-6 text-end">
          <button onClick={toggleForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'black' }}>
            <FontAwesomeIcon icon={isFormVisible ? faChevronUp : faChevronDown} size="lg" />
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="mb-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Rechercher sur la liste" 
            value={query}
            onChange={handleQueryChange}
          />
        </div>
      )}

      <div className="table-responsive">
        {filteredInfos.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Pays</th>
                <th>Secteur - Industrie</th>
                <th>Capitalisation</th>
                <th>Eligible PEA</th>
                <th>Verse Dividende</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfos.map(company => (
                <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                  <td className="d-flex align-items-center">
                    <img src={company.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }}/>
                    <div>
                      <div>{company.Name}</div>
                      <div>{company.symbol}</div>
                    </div>
                  </td>
                  <td>{company.pays}</td>
                  <td>{company.secteur} - {company.industrie}</td>
                  <td>{company.marketcap}</td>
                  <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                  <td>{company.VerseDividende ? 'Oui' : 'Non'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-warning" role="alert">
            Aucune entreprise disponible
          </div>
        )}
      </div>
    </section>
  );
}
