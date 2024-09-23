import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analyse(props) {
    const [force, setForce] = useState("");
    const [risque, setRisque] = useState("");
    const [forces, setForces] = useState([]);
    const [risques, setRisques] = useState([]);
    useEffect(() => {
        if (props.id) {
          axios.post('http://localhost:4000/listanalyse', { symbol, props.id })
            .then(res => {
              const forcesData = res.data.filter(item => item.type === 'force');
              const risquesData = res.data.filter(item => item.type === 'risque');
              setForces(forcesData);
              setRisques(risquesData);
            });
        }
      }, [symbol, props.id]);
    const sendForce = (e) => {
        e.preventDefault();
        if (force.trim().length > 0) {
          axios.post('http://localhost:4000/sendforce', { symbol, props.id, force }).then(() => {
            setForce('');
          });
        }
      };
    
      const sendRisque = (e) => {
        e.preventDefault();
        if (risque.trim().length > 0) {
          axios.post('http://localhost:4000/sendrisque', { symbol, props.id, risque }).then(() => {
            setRisque('');
          });
        }
      };
    
      const supprimer = (index) => {
        axios.post('http://localhost:4000/deleteanalyse', { index });
      };
    
  return (
    <div>
              <form onSubmit={sendForce}>
              <label>Force :</label>
              <input type="text" className="form-control" value={force} onChange={e => setForce(e.target.value)} />
              <button type="submit" className="btn btn-success mt-2">Soumettre</button>
            </form>
            <ul className="list-group mt-3">
              {forces.map((forceItem, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {forceItem.content}
                  <button className="btn btn-danger btn-sm" onClick={() => supprimer(forceItem.props.id)}>Supprimer</button>
                </li>
              ))}
            </ul>

            <form onSubmit={sendRisque} className="mt-4">
              <label>Risque :</label>
              <input type="text" className="form-control" value={risque} onChange={e => setRisque(e.target.value)} />
              <button type="submit" className="btn btn-success mt-2">Soumettre</button>
            </form>
            <ul className="list-group mt-3">
              {risques.map((risqueItem, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {risqueItem.content}
                  <button className="btn btn-danger btn-sm" onClick={() => supprimer(risqueItem.props.id)}>Supprimer</button>
                </li>
              ))}
            </ul>
    </div>
  )
}
