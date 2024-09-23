import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Prix from './Prix';
import 'bootstrap/dist/css/bootstrap.min.css';
import Foire from './Foire';

export default function Details() {
  const [activeTab, setActiveTab] = useState('Informations');
  const type = "admin";
  const { symbol } = useParams();
  const [id, setId] = useState(0);
  const [infos, setInfos] = useState({});
  const [exist, setExist] = useState(true);

  const formatNumber = (num) => (num / 1e9).toFixed(3) + ' MDS';

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id))

    axios.post('http://localhost:4000/listcompany', { symbol })
      .then(res => {
        if (res.data.length > 0) {
          setInfos(res.data[0]);
        }
      })
  }, [symbol]);

  useEffect(() => {
    if (id > 0) {
      axios.post('http://localhost:4000/checkcompany', { symbol, id, type })
        .then(res => setExist(res.data.exist))
    }
  }, [symbol, id]);

  const add = () => {
    axios.post('http://localhost:4000/addcompany', { symbol, id, type })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      })
  };

  const removeFromWatchlist = () => {
    axios.post('http://localhost:4000/deletecompany', { symbol, id, type })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      })
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img
            src={infos.logo}
            alt={`${infos.Name} logo`}
            width="40"
            height="40"
            style={{ marginRight: '15px' }}
          />
          <div>
            <h2 className="company-name" style={{ margin: 0 }}>{infos.Nom}</h2>
            <p className="stock-price" style={{ margin: 0 }}>{infos.symbol}</p>
          </div>
        </div>
        {exist ? (
          <button className="btn btn-danger btn-sm" onClick={removeFromWatchlist}>Retirer de la watchlist</button>
        ) : (
          <button className="btn btn-success btn-sm" onClick={add}>Ajouter à la watchlist</button>
        )}
      </div>

      <div className="info-section mr-50" style={{ width: '100%' }}>
        <Prix />
      </div>

      <div className="info-section" style={{ width: '100%' }}>
        <Foire />
      </div>
    </div>
  );
}
