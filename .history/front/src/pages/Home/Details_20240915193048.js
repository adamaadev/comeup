import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Prix from './Prix';
import Foire from './Foire';
import Region from './Region';
import Quali from './Quali';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vente from './Vente';

export default function Details() {
  const [activeTab, setActiveTab] = useState('Informations');
  const type = "user";
  const { symbol } = useParams();
  const [id, setId] = useState(0);
  const [infos, setInfos] = useState({});
  const [exist, setExist] = useState(true);

  const formatNumber = (num) => (num / 1e9).toFixed(3) + 'MDS';

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id));

    axios.post('http://localhost:4000/listcompany', { symbol })
      .then(res => {
        if (res.data.length > 0) {
          setInfos(res.data[0]);
        }
      });
  }, [symbol]);

  useEffect(() => {
    if (id > 0) {
      axios.post('http://localhost:4000/checkcompany', { symbol, id, type })
        .then(res => setExist(res.data.exist));
    }
  }, [symbol, id]);

  const add = () => {
    axios.post('http://localhost:4000/addcompany', { symbol, id, type })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      });
  };

  const removeFromWatchlist = () => {
    axios.post('http://localhost:4000/deletecompany', { symbol, id, type })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img
            src={infos.logo}
            alt={`${infos.Name} logo`}
            width="60"
            height="60"
            style={{ marginRight: '15px' }}
          />
          <div>
            <h2 className="company-name" style={{ margin: 0 }}>{infos.Nom}</h2>
            <p className="stock-price" style={{ margin: 0 }}>{infos.price} {infos.currency}</p>
          </div>
        </div>
        {exist ? (
          <button className="btn btn-danger btn-sm" onClick={removeFromWatchlist}>Retirer de la watchlist</button>
        ) : (
          <button className="btn btn-success btn-sm" onClick={add}>Ajouter à la watchlist</button>
        )}
      </div>
      <ul className="nav nav-tabs d-flex flex-nowrap overflow-auto">
  <li className="nav-item">
    <button className={`nav-link text-nowrap ${activeTab === 'Informations' ? 'active' : ''}`} onClick={() => handleTabChange('Informations')}>
      Informations
    </button>
  </li>
  <li className="nav-item">
    <button className={`nav-link text-nowrap ${activeTab === 'qual' ? 'active' : ''}`} onClick={() => handleTabChange('qual')}>
      Analyse Quantitative
    </button>
  </li>
  <li className="nav-item">
    <button className={`nav-link text-nowrap ${activeTab === 'quant' ? 'active' : ''}`} onClick={() => handleTabChange('quant')}>
      Analyse Qualitative
    </button>
  </li>
</ul>

      <div className="tab-content mt-4">
        {activeTab === 'Informations' && (
          <div className="row">
            <div className="col-lg-8 col-md-12 mb-4">
              <div className="card p-3">
                <Prix symbol={symbol} />
              </div>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="card p-3">
                <h4>Informations Générales</h4>
                <p>Ticker : {infos.symbol}</p>
                <p>Secteur & Industrie : {infos.secteur} - {infos.industrie}</p>
                <p>Site web : <a href={infos.website} target="_blank" rel="noopener noreferrer">{infos.website}</a></p>
                <p>Capitalisation : {infos.Capitalisation ? formatNumber(infos.Capitalisation) : 'N/A'}</p>
                <p>Prix : {infos.price}</p>
                <p>Exchange : {infos.exchangeShortName}</p>
                <p>Pays : {infos.pays}</p>
                <p>Isin : {infos.isin}</p>
                <p>Éligible au PEA : {infos.eligiblePea === 1 ? 'Oui' : 'Non'}</p>
                <p>Verse Dividende : {infos.verseDividende === 1 ? 'Oui' : 'Non'}</p>
              </div>
            </div>
            <div className="d-flex">
              <div 
                className="card mt-1 p-3 ms-3" 
                style={{ 
                  maxWidth: '1000px', 
                  maxHeight: '1500px', 
                  overflowX: 'auto', // Ajoute un défilement horizontal si nécessaire
                  overflowY: 'hidden', // Enlève le défilement vertical
                  position: 'relative' // Position relative pour les éléments internes
                }}
              >
                <div style={{ minWidth: '1000px', minHeight: '500px' }}> {/* Assurez-vous que ce contenu est plus large que la carte */}
                  <Region symbol={symbol} />
                </div>
              </div>

              <div 
                className="card mt-1 p-3 ms-3" 
                style={{ 
                  maxWidth: '1000px', 
                  maxHeight: '1500px', 
                  overflowX: 'auto', // Ajoute un défilement horizontal si nécessaire
                  overflowY: 'hidden', // Enlève le défilement vertical
                  position: 'relative' // Position relative pour les éléments internes
                }}
              >
                <div style={{ minWidth: '1000px', minHeight: '500px' }}> {/* Assurez-vous que ce contenu est plus large que la carte */}
                  <Vente symbol={symbol} />
                </div>
              </div>
          </div>

          </div>
        )}
        {activeTab === 'quant' && (
          <Foire symbol={symbol} />
        )}
        {activeTab === 'qual' && (
          <Quali symbol={symbol} />
        )}
      </div>
    </div>
  );
}
