import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Analyse from './Analyse';
import Statistiques from './Statistiques';
import Infos from './Infos';

export default function Details() {
  const { symbol } = useParams();
  const [exist, setExist] = useState(true);
  const [infos, setInfos] = useState([]);
  const [id, setId] = useState();
  const [activeTab, setActiveTab] = useState('profile');
  const [logo, setLogo] = useState();

  const europeanCountries = [
    'France', 'Germany', 'United Kingdom', 'Italy', 'Spain', 'Poland', 'Netherlands',
    'Belgium', 'Greece', 'Czech Republic', 'Portugal', 'Sweden', 'Hungary', 'Austria',
    'Switzerland', 'Bulgaria', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland',
    'Croatia', 'Lithuania', 'Slovenia', 'Latvia', 'Estonia', 'Luxembourg', 'Cyprus',
    'Malta', 'Romania'
  ];

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.success) {
          setId(res.data.id);
        }
      });
    axios.post('http://localhost:4000/getlogo', { symbol }).then(res => {
      setLogo(res.data.logo);
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
        const { companyName, image, symbol, country, mktCap, sector, dividend } = res.data[0];
        if (!image || image === 'error') {
          axios.get(`https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s/g, '')}.com`)
            .then(response => {
              const newImage = response.request.responseURL;
              setInfos([{ ...res.data[0], image: newImage, dividend: dividend }]);
            })
            .catch(error => {
              setInfos([{ ...res.data[0], dividend: dividend }]);
            });
        } else {
          setInfos([{ ...res.data[0], dividend: dividend }]);
        }

        axios.post('http://localhost:4000/checkcompany', { companyName, image, symbol, country, mktCap, sector })
          .catch(error => {
          });
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

  const isPEAEligible = (country) => {
    return europeanCountries.includes(country);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="card">
            <div className="card-body">
              {infos.map((info, index) => (
                <div key={index} className="mb-3">
                  <img src={logo} className="img-fluid mb-3" width={75} alt="Company" />
                  <p><strong>Symbol : </strong> {info.symbol}</p>
                  <p><strong>Industry : </strong> {info.industry}</p>
                  <p><strong>Sector : </strong> {info.sector}</p>
                  <p><strong>Website : </strong> <a href={info.website}>{info.website}</a></p>
                  <p><strong>Market Cap : </strong> {info.mktCap}</p>
                  <p><strong>Price : </strong> {info.price} {info.currency}</p>
                  <p><strong>Exchange : </strong> {info.exchangeShortName}</p>
                  <p><strong>Pays : </strong> {info.country}</p>
                  <p><strong>Isin : </strong> {info.isin}</p>
                  <p><strong>Eligible PEA : </strong> {isPEAEligible(info.country) ? 'Oui' : 'Non'}</p>
                  <p><strong>Verse une Dividende : </strong> {info.dividend > 0 ? 'Oui' : 'Non'}</p>
                </div>
              ))}
              <Infos symbol={symbol} />
            </div>
          </div>
        );
      case 'financials':
        return (
          <Statistiques symbol={symbol} />
        );
      case 'news':
        return (
          <Analyse id={id} symbol={symbol} />
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
