import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [id, setid] = useState();
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symbolData, setSymbolData] = useState([]);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => setid(res.data.id));
    axios.get('http://localhost:4000/list').then(res => setSymbols(res.data))
  }, []);

  useEffect(() => {
    if (symbols.length > 0) {
      const fetchSymbolsInfo = async () => {
        try {
          const requests = symbols.map(symbol =>
            axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol.symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
          );
          const responses = await Promise.all(requests);
          const symbolsData = responses.map((response, index) => ({ ...response.data[0], id: symbols[index].id
          }));
          setSymbolData(symbolsData);
        } catch (error) {
          console.error("Erreur lors de la récupération des informations des symboles:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSymbolsInfo();
    }
  }, [symbols]);

  const handleMessageButtonClick = () => {
    setShowForm(true);
  };

  return (
    <section className="container mt-4">
      <h2 className="mb-4">Watchlist Bourse Impact    <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
        /></h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        symbolData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Symbol</th>
                  <th>Secteur</th>
                  <th>Pays</th>
                  <th>Industrie</th>
                </tr>
              </thead>
              <tbody>
                {symbolData.map((symbol, index) => (
                  <tr key={index} onClick={(e)=>{ e.preventDefault(); navigate(`/details/${symbol.symbol}`)}}>
                    <td>{index + 1}</td>
                    <td><img src={symbol.image} alt="Company Logo" style={{ width: '50px', height: 'auto' }} /></td>
                    <td>{symbol.companyName}</td>
                    <td>{symbol.symbol}</td>
                    <td>{symbol.sector}</td>
                    <td>{symbol.country}</td>
                    <td>{symbol.industry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucun symbole trouvé.</p>
        )
      )}
      <div className="mt-4">
        {showForm ? (
          <form>
            <p>{name}</p>
            <button onClick={()=>{setShowForm(false)}}>fermer</button>
          </form>
        ) : (
          <p>Nous contacter !</p>
        )}
        <button className='btn btn-success' onClick={handleMessageButtonClick}>Messagerie</button>
        <br />
        <a className='btn btn-success' href="mailto:">Email</a>
      </div>
    </section>
  );
}
