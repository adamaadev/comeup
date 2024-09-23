import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Infos from './Infos';
import Analyse from './Analyse'
export default function Details() {
  const { symbol } = useParams();
  const [exist, setExist] = useState(true);
  const [infos, setInfos] = useState({});
  const [id, setId] = useState();
  const [activeTab, setActiveTab] = useState('profile');
  const [logo, setLogo] = useState();
  const [countryMapping, setCountryMapping] = useState({});

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchCountryNames();
    fetchDetails();
  }, []);

  useEffect(() => {
    if (symbol && id) {
      checkIfInWatchlist();
    }
  }, [symbol, id]);

  const fetchCountryNames = async () => {
    try {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      const mapping = {};
      res.data.forEach(country => {
        const code = country.cca2;
        const name = country.name.common;
        mapping[code] = { name, eligiblePEA: country.region === 'Europe' };
      });
      setCountryMapping(mapping);
    } catch (error) {
      console.error('Error fetching country names:', error);
    }
  };

  const fetchDetails = () => {
    axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        const companyData = res.data[0];
        const { companyName, image, symbol, country, mktCap, sector, website, price, exchangeShortName, isin } = companyData;
        const newImage = image ? image : `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s/g, '')}.com`;
        setInfos({
          companyName,
          image: newImage,
          symbol,
          sector,
          mktCap,
          website,
          price,
          exchangeShortName,
          country,
          isin,
          eligiblePEA: getEligibilityForPEA(country)
        });
        setLogo(newImage);
      })
      .catch(error => console.error('Error fetching company details:', error));
  };

  const getEligibilityForPEA = (code) => {
    return countryMapping[code]?.eligiblePEA || false;
  };

  const checkIfInWatchlist = () => {
    axios.post('http://localhost:4000/checkforuser', { symbol, id })
      .then(response => setExist(response.data.exist))
      .catch(error => console.error('Error checking watchlist:', error));
  };

  const add = () => {
    axios.post('http://localhost:4000/addforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      })
      .catch(error => console.error('Error adding to watchlist:', error));
  };

  const removeFromWatchlist = () => {
    axios.post('http://localhost:4000/deleteforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      })
      .catch(error => console.error('Error removing from watchlist:', error));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <img src={logo} className="img-fluid" width={75} alt="Company" />
            <p><strong>Ticker : </strong> {infos.symbol}</p>
            <p><strong>Secteur & Industrie : </strong>{infos.sector}</p>
            <p><strong>Site web : </strong> {infos.website === '' ? '' : <a href={infos.website}>{infos.website}</a>}</p>
            <p><strong>Capitalisation : </strong> {infos.mktCap}</p>
            <p><strong>Prix : </strong> {infos.price} {infos.currency}</p>
            <p><strong>Exchange : </strong> {infos.exchangeShortName}</p>
            <p><strong>Pays : </strong> {getFullCountryName(infos.country)}</p>
            <p><strong>Isin : </strong> {infos.isin}</p>
            <p><strong>Éligible au PEA : </strong> {infos.eligiblePEA ? 'Oui' : 'Non'}</p>
            <Infos symbol={symbol}/>
          </div>
        );
      case 'financials':
        return (
          <p>financiers</p>
        );
      case 'news':
        return (
          <div>
            News Content
          </div>
        );
      default:
        return null;
    }
  };

  const getFullCountryName = (code) => {
    return countryMapping[code]?.name || code;
  };

  return (
    <div className="container mt-4">
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Nom : {infos.companyName}</h2>
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
          </ul>
          <div className="mt-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
