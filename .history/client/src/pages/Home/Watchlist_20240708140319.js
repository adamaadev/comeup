import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const [id, setid] = useState();
  const navigate = useNavigate();
  const [symbols, setSymbols] = useState([]);
  const [symbolData, setSymbolData] = useState([]);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000')
      .then(res => {
        setid(res.data.id);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération du nom d\'utilisateur :', err);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/list', { id })
        .then(res => {
          console.log(res.data);
          setSymbols(res.data);
        })
        .catch(err => {
          console.error('Erreur lors de la récupération de la liste des symboles :', err);
        });
    }
  }, [id]);

  useEffect(() => {
    if (symbols.length > 0) {
      const fetchSymbolsInfo = async () => {
        try {
          const requests = symbols.map(symbol =>
            axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol.symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
          );
          const responses = await Promise.all(requests);
          const symbolsData = responses.map(response => response.data[0]); // Récupérer le premier élément de chaque réponse
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

  return (
    <section className="container mt-4">
      <h2>Ma watchlist</h2>
      <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
        />
      {loading ? (
        <p>Loading...</p>
      ) : (
        symbolData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Symbole</th>
                  <th scope="col">Image</th>
                  <th scope="col">Secteur</th>
                  <th scope="col">Pays</th>
                  <th scope="col">Industrie</th>
                </tr>
              </thead>
              <tbody>
                {symbolData.map((symbol, index) => (
                  <tr key={index} onClick={(e)=>{ e.preventDefault(); navigate(`/details/${symbol.symbol}`)}}>
                    <td>{symbol.symbol}</td>
                    <td><img src={symbol.image} alt="Company Logo" className="img-thumbnail" style={{ maxWidth: '50px' }} /></td>
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
    </section>
  );
}
