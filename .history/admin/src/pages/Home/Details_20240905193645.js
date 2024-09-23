import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Analyse from './Analyse';
import Douve from './Douve';
import Scenario from './Scenario';

export default function Details() {
  const type = "admin";
  const { symbol } = useParams();
  const [id, setId] = useState(0);
  const [infos, setInfos] = useState({});
  const [exist, setExist] = useState(true);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id))

    axios.post('http://localhost:4000/listcompany', { symbol })
      .then(res => {
        if (res.data.length > 0) {
          setInfos(res.data[0]);
        }
      })
      .catch(error => console.error('Error fetching company information:', error));

  }, [symbol]);

  useEffect(() => {
    if (id > 0) {
      axios.post('http://localhost:4000/checkcompany', { symbol, id , type })
        .then(res => setExist(res.data.exist))
    }
  }, [symbol, id]);

  const add = () => {
    console.log(id);
    
    axios.post('http://localhost:4000/addcompany', { symbol, id, type })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      })
  };

  const removeFromWatchlist = () => {
    axios.post('http://localhost:4000/deletecompany', { symbol, id , type })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      })
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div className="d-flex align-items-center mb-3">
              {infos.logo && (
                <img
                  src={infos.logo}
                  alt={`${infos.Name} logo`}
                  width="100"
                  height="100"
                  style={{ marginRight: '20px' }}
                />
              )}
              <div>
                <p><strong>Ticker : </strong> {infos.symbol}</p>
                <p><strong>Secteur & Industrie : </strong>{infos.secteur} - {infos.industrie}</p>
                <p><strong>Site web : </strong><a href={infos.website} target="_blank" rel="noopener noreferrer">{infos.website}</a></p>
                <p><strong>Capitalisation : </strong> {infos.marketcap ? formatNumber(infos.marketcap) : 'N/A'}</p>
                <p><strong>Prix : </strong> {infos.price}</p>
                <p><strong>Exchange : </strong> {infos.exchangeShortName}</p>
                <p><strong>Pays : </strong> {infos.pays}</p>
                <p><strong>Isin : </strong> {infos.isin}</p>
                <p><strong>Éligible au PEA : </strong> {infos.eligiblePea ? 'Oui' : 'Non'}</p>
                <p><strong>Verse Dividende : </strong> {infos.verseDividende ? 'Oui' : 'Non'}</p>
              </div>
            </div>
          </div>
        );
      case 'financials':
        return <p>Statistiques financières ici...</p>;
      case 'news':
        return <Analyse id={id} symbol={symbol} />;
      case 'douve':
        return <Scenario id={id} symbol={symbol} />;
      default:
        return null;
    }
  };

  const formatNumber = (num) => (num / 1e9).toFixed(3) + ' milliard';

  return (
    <div className="container mt-4">
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">{infos.Name}</h2>
          {exist ? (
            <button className="btn btn-danger btn-sm" onClick={removeFromWatchlist}>Retirer de la watchlist</button>
          ) : (
            <button className="btn btn-success btn-sm" onClick={add}>Ajouter à la watchlist</button>
          )}
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Informations</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>Analyse Quantitative</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>Statistiques</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'douve' ? 'active' : ''}`} onClick={() => setActiveTab('douve')}>Douve</button>
            </li>
          </ul>
          <div className="mt-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
