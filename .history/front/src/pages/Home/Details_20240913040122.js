import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Prix from './Prix';
import Foire from './Foire';
import Region from './Region';
import Quali from './Quali';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

const TabList = styled.ul`
  display: flex;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const TabItem = styled.li`
  margin-right: 1rem;
`;

const TabButton = styled.button`
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: ${props => props.active ? '#e9ecef' : 'transparent'};
  border: ${props => props.active ? '1px solid #dee2e6' : 'none'};
`;

const Container = styled.div`
  margin-top: 1rem;
`;

const InfoSection = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FlexItem = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

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
      <TabList>
        <TabItem>
          <TabButton 
            active={activeTab === 'Informations'}
            onClick={() => handleTabChange('Informations')}
          >
            Informations
          </TabButton>
        </TabItem>
        <TabItem>
          <TabButton 
            active={activeTab === 'quant'}
            onClick={() => handleTabChange('quant')}
          >
            Analyse Qualitative
          </TabButton>
        </TabItem>
        <TabItem>
          <TabButton 
            active={activeTab === 'qual'}
            onClick={() => handleTabChange('qual')}
          >
            Analyse Quantitative
          </TabButton>
        </TabItem>
      </TabList>
      <Container>
        {activeTab === 'Informations' && (
          <FlexContainer>
            <FlexItem>
              <Prix symbol={symbol}/>
              <Region symbol={symbol}/>
            </FlexItem>
            <InfoSection>
              <h4>Informations Générales</h4>
              <p>Ticker : {infos.symbol}</p>
              <p>Secteur & Industrie : {infos.secteur} - {infos.industrie}</p>
              <p>Site web : <a href={infos.website} target="_blank" rel="noopener noreferrer">{infos.website}</a></p>
              <p>Capitalisation : {infos.Capitalisation ? formatNumber(infos.Capitalisation) : 'N/A'}</p>
              <p>Prix : {infos.price}</p>
              <p>Exchange : {infos.exchangeShortName}</p>
              <p>Pays : {infos.pays}</p>
              <p>Isin : {infos.isin}</p>
              <p>Éligible au PEA : {infos.eligiblePea ? 'Oui' : 'Non'}</p>
              <p>Verse Dividende : {infos.verseDividende ? 'Oui' : 'Non'}</p>
            </InfoSection>
          </FlexContainer>
        )}
        {activeTab === 'quant' && (
          <Foire symbol={symbol} />
        )}
        {activeTab === 'qual' && (
          <Quali symbol={symbol} />
        )}
      </Container>
    </div>
  );
}
