import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Analyse from './Analyse';
import Douve from './Douve';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Box
} from '@mui/material';

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
          <Box>
            <Box display="flex" alignItems="center" mb={3}>
              {infos.logo && (
                <img
                  src={infos.logo}
                  alt={`${infos.Name} logo`}
                  width="100"
                  height="100"
                  style={{ marginRight: '20px' }}
                />
              )}
              <Box>
                <Typography variant="body1"><strong>Ticker :</strong> {infos.symbol}</Typography>
                <Typography variant="body1"><strong>Secteur & Industrie :</strong> {infos.secteur} - {infos.industrie}</Typography>
                <Typography variant="body1"><strong>Site web :</strong> <a href={infos.website} target="_blank" rel="noopener noreferrer">{infos.website}</a></Typography>
                <Typography variant="body1"><strong>Capitalisation :</strong> {infos.marketcap ? formatNumber(infos.marketcap) : 'N/A'}</Typography>
                <Typography variant="body1"><strong>Prix :</strong> {infos.price}</Typography>
                <Typography variant="body1"><strong>Exchange :</strong> {infos.exchangeShortName}</Typography>
                <Typography variant="body1"><strong>Pays :</strong> {infos.pays}</Typography>
                <Typography variant="body1"><strong>Isin :</strong> {infos.isin}</Typography>
                <Typography variant="body1"><strong>Éligible au PEA :</strong> {infos.eligiblePea ? 'Oui' : 'Non'}</Typography>
                <Typography variant="body1"><strong>Verse Dividende :</strong> {infos.verseDividende ? 'Oui' : 'Non'}</Typography>
              </Box>
            </Box>
          </Box>
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
    <Container>
      <Card>
        <CardHeader
          title={infos.Name}
          action={
            exist ? (
              <Button variant="contained" color="error" size="small" onClick={removeFromWatchlist}>
                Retirer de la watchlist
              </Button>
            ) : (
              <Button variant="contained" color="success" size="small" onClick={add}>
                Ajouter à la watchlist
              </Button>
            )
          }
        />
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Informations" value="profile" />
            <Tab label="Analyse Quantitative" value="news" />
            <Tab label="Statistiques" value="financials" />
            <Tab label="Douve" value="douve" />
          </Tabs>
          <Box mt={3}>
            {renderTabContent()}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
