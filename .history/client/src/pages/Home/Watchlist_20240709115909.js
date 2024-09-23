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
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/list', { id })
        .then(res => {
          console.log(res.data);
          setSymbols(res.data);
        })
    }
  }, [id]);


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
  
            </table>
          </div>
        ) : (
          <p>Aucun symbole trouvé.</p>
        )
      )}
    </section>
  );
}
