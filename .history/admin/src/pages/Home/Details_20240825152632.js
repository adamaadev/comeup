import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardActions, Tabs, Tab, Typography, Button, Avatar } from '@mui/material';
import Analyse from './Analyse';
import Douve from './Douve';

export default function Details() {
  const type = "admin";
  const { symbol } = useParams();
  const [id, setId] = useState(0);
  const [infos, setInfos] = useState({});
  const [exist, setExist] = useState(true);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id));

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              {infos.logo && (
                <Avatar src={infos.logo} alt={`${infos.Name} logo`} sx={{ width: 100, height: 100, marginRight: '16px' }} />
              )}
              <div>
                <Typography><strong>Ticker: </strong>{infos.symbol}</Typography>
                <Typography><strong>Secteur & Industrie: </strong>{infos.secteur} - {infos.industrie}</Typography>
                <Typography><strong>Site web: </strong><a href={infos.website} target="_blank" rel="noopener noreferrer">{infos.website}</a></Typography>
                <Typography><strong>Capitalisation: </strong>{infos.marketcap ? formatNumber(infos.marketcap) : 'N/A'}</Typography>
                <Typography><strong>Prix: </strong>{infos.price}</Typography>
                <Typography><strong>Exchange: </strong>{infos.exchangeShortName}</Typography>
                <Typography><strong>Pays: </strong>{infos.pays}</Typography>
                <Typography><strong>Isin: </strong>{infos.isin}</Typography>
                <Typography><strong>Éligible au PEA: </strong>{infos.eligiblePea ? 'Oui' : 'Non'}</Typography>
                <Typography><strong>Verse Dividende: </strong>{infos.verseDividende ? 'Oui' : 'Non'}</Typography>
              </div>
            </div>
          </div>
        );
      case 'financials':
        return <Typography>Statistiques financières ici...</Typography>;
      case 'news':
        return <Analyse id={id} symbol={symbol} />;
      case 'douve':
        return <Douve id={id} symbol={symbol} />;
      default:
        return null;
    }
  };

  const formatNumber = (num) => (num / 1e9).toFixed(3) + ' milliard';

  return (
    <div className="container mt-4">
      <Card>
        <CardHeader
          title={infos.Name}
          action={
            <Button
              variant="contained"
              color={exist ? "error" : "success"}
              onClick={exist ? removeFromWatchlist : add}
            >
              {exist ? 'Retirer de la watchlist' : 'Ajouter à la watchlist'}
            </Button>
          }
        />
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            aria-label="Tabs"
          >
            <Tab label="Informations" value="profile" />
            <Tab label="Analyse Quantitative" value="news" />
            <Tab label="Statistiques" value="financials" />
            <Tab label="Douve" value="douve" />
          </Tabs>
          <div style={{ marginTop: '16px' }}>
            {renderTabContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
