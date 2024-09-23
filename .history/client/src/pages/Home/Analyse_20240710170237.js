import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analyse({ id, symbol }) {
  const [force, setForce] = useState("");
  const [risque, setRisque] = useState("");
  const [forces, setForces] = useState([]);
  const [risques, setRisques] = useState([]);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/listanalyse', { symbol, id })
        .then(res => {
          const forcesData = res.data.filter(item => item.type === 'force');
          const risquesData = res.data.filter(item => item.type === 'risque');
          setForces(forcesData);
          setRisques(risquesData);
        });
    }
  }, [symbol, id]);

  const sendForce = (e) => {
    e.preventDefault();
    if (force.trim().length > 0) {
      axios.post('http://localhost:4000/sendforce', { symbol, id, force }).then(() => {
        setForce('');
        fetchAnalysis(); // Refresh the list after submission
      });
    }
  };

  const sendRisque = (e) => {
    e.preventDefault();
    if (risque.trim().length > 0) {
      axios.post('http://localhost:4000/sendrisque', { symbol, id, risque }).then(() => {
        setRisque('');
        fetchAnalysis(); // Refresh the list after submission
      });
    }
  };

  const supprimer = (index) => {
    axios.post('http://localhost:4000/deleteanalyse', { index }).then(() => {
      fetchAnalysis(); // Refresh the list after deletion
    });
  };

  const fetchAnalysis = () => {
    if (id) {
      axios.post('http://localhost:4000/listanalyse', { symbol, id })
        .then(res => {
          const forcesData = res.data.filter(item => item.type === 'force');
          const risquesData = res.data.filter(item => item.type === 'risque');
          setForces(forcesData);
          setRisques(risquesData);
        });
    }
  };

  return (
    <div>
      <form onSubmit={sendForce}>
        <label>Force :</label>
        <input
          type="text"
          className="form-control"
          value={force}
          onChange={e => setForce(e.target.value)}
        />
        <button type="submit" className="btn btn-success mt-2">Soumettre</button>
      </form>
      <ul className="list-group mt-3">
        {forces.map((forceItem, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {forceItem.content}
            <button className="btn btn-danger btn-sm" onClick={() => supprimer(forceItem.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      <form onSubmit={sendRisque} className="mt-4">
        <label>Risque :</label>
        <input
          type="text"
          className="form-control"
          value={risque}
          onChange={e => setRisque(e.target.value)}
        />
        <button type="submit" className="btn btn-success mt-2">Soumettre</button>
      </form>
      <ul className="list-group mt-3">
        {risques.map((risqueItem, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {risqueItem.content}
            <button className="btn btn-danger btn-sm" onClick={() => supprimer(risqueItem.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      <Foire/>
    </div>
  );
}
