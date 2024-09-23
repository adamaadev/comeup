import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Watchlist() {
  const type = "admin";
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [countryTranslations, setCountryTranslations] = useState({});

  axios.defaults.withCredentials = true;

  // Fetch watchlist data
  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        console.log('ID fetched:', res.data.id);
        setId(res.data.id);
      })
      .catch(err => console.error('Error fetching ID:', err));
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/watchlist', { id, type })
        .then(res => {
          console.log('Watchlist data:', res.data);
          setInfos(res.data);
        })
        .catch(err => console.error('Error fetching watchlist:', err));
    }
  }, [id]);

  // Fetch country translations
  useEffect(() => {
    const fetchCountryTranslations = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const translations = response.data.reduce((acc, country) => {
          acc[country.cca2] = country.translations.fra.common;
          return acc;
        }, {});
        console.log('Country translations:', translations);
        setCountryTranslations(translations);
      } catch (error) {
        console.error('Error fetching country translations:', error);
      }
    };

    fetchCountryTranslations();
  }, []);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const filteredInfos = infos.filter(info =>
    info.Name.toLowerCase().includes(query.toLowerCase()) ||
    info.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
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
            onChange={handleQueryChange}
          />
        </div>
      </div>
      <div className="table-responsive">
        {filteredInfos.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Pays</th>
                <th>Secteur</th>
                <th>Industrie</th>
                <th style={{ whiteSpace: 'nowrap' }}>Capitalisation (MDS)</th>
                <th>PEA</th>
                <th>Dividende</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfos.map(company => (
                <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                  <td className="d-flex align-items-center">
                    <img src={company.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }}/>
                    <div>
                      <div>{company.Name}</div>
                      <div>{company.symbol} : <strong>{company.exchangeShortName}</strong></div>
                    </div>
                  </td>
                  <td>{countryTranslations[company.countryCode] || company.countryCode}</td>
                  <td>{company.secteur}</td>
                  <td>{company.industrie}</td>
                  <td>{formatNumber(company.marketcap)}</td>
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
