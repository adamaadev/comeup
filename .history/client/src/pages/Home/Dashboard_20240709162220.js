import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [id, setid] = useState();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => setid(res.data.id));
    axios.get('http://localhost:4000/list').then(res => console.log(res))
  }, []);

  return (
    <section className="container mt-4">
      <h2 className="mb-4">Watchlist Bourse Impact    <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
        /></h2>
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
        
              </tbody>
            </table>
          </div>
      <div className="mt-4">
        <a className='btn btn-success' href="mailto:">Email</a>
      </div>
    </section>
  );
}