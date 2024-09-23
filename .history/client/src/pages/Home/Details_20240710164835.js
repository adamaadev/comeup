import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Analyse from './Analyse';

export default function Details() {
  const { symbol } = useParams();
  const [exist, setExist] = useState(true);
  const [infos, setInfos] = useState([]);
  const [id, setId] = useState();
  const [activeTab, setActiveTab] = useState('news');

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.success) {
          setId(res.data.id);
        }
      });
  }, []);


  useEffect(() => {
    if (symbol && id) {
      axios.post('http://localhost:4000/checkforuser', { symbol, id })
        .then(response => setExist(response.data.exist));
    }
  }, [symbol, id]);

  useEffect(() => {
    axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        setInfos([res.data[0]]) 
        const {companyName , image , symbol , country , mktCap , sector} = res.data[0];
        axios.post('http://localhost:4000/checkcompany',{ companyName , image , symbol , country , mktCap , sector })
      });
  }, [symbol]);


  const add = (symbol) => {
    axios.post('http://localhost:4000/addforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      });
  };

  const deleteItem = (symbol) => {
    axios.post('http://localhost:4000/deleteforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return infos.map((info, index) => (
          <div key={index}>
            <img src={info.image} className="img-fluid" alt="Company" />
            <p><strong>Symbol:</strong> {info.symbol}</p>
            <p><strong>CEO:</strong> {info.ceo}</p>
            <p><strong>Industry:</strong> {info.industry}</p>
            <p><strong>Sector:</strong> {info.sector}</p>
            <p><strong>Website:</strong> <a href={info.website}>{info.website}</a></p>
            <p><strong>Market Cap:</strong> {info.mktCap}</p>
            <p><strong>Price:</strong> {info.price}</p>
            <p><strong>Address:</strong> {info.address}, {info.city}, {info.country}</p>
            <p><strong>Currency:</strong> {info.currency}</p>
          </div>
        ));
      case 'financials':
        return <p>Les données financières seront affichées ici.</p>;
      case 'news':
        return (
          <div>
              <Analyse id={id} symbol={symbol} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Nom : {infos[0]?.companyName}</h2>
          {exist ? (
            <button className="btn btn-danger btn-sm" onClick={() => deleteItem(symbol)}>Retirer de la watchlist</button>
          ) : (
            <button className="btn btn-success btn-sm" onClick={() => add(symbol)}>Ajouter à la watchlist</button>
          )}
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Informations</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>Analyse</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>Statistiques</button>
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
