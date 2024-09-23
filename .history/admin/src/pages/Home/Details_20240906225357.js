import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const StockChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1y'); // Default to 1 year

  const fetchData = async (range) => {
    setLoading(true);
    try {
      let days;
      switch (range) {
        case '1y':
          days = 365;
          break;
        case '5y':
          days = 1825;
          break;
        case '6m':
          days = 183; // Approximativement 6 mois
          break;
        case '1m':
          days = 30;
          break;
        case '1w':
          days = 7;
          break;
        default:
          days = 365;
      }

      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=${days}&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      let data = response.data.historical.reverse();

      // Filtrage des données
      switch (range) {
        case '1y':
          data = data.filter((item) => {
            const date = new Date(item.date);
            return date.getDate() === 1; // Premier jour de chaque mois
          });
          break;
        case '5y':
          data = data.filter((item, index) => index % 30 === 0); // Un point tous les mois (approximatif)
          break;
        case '6m':
          data = data.filter((item, index) => index % 5 === 0); // Un point tous les cinq jours (approximatif)
          break;
        case '1m':
          // Pas besoin de filtrer, car nous voulons tous les jours pour 1 mois
          break;
        case '1w':
          // Pas besoin de filtrer, car nous voulons tous les jours pour 1 semaine
          break;
        default:
          data = data.filter(() => true); // Afficher toutes les données par défaut
          break;
      }

      // Convertir les dates en format approprié
      const formatDate = (date) => {
        const d = new Date(date);
        if (range === '1w') {
          return d.toLocaleDateString('default', { weekday: 'long' }); // Format de jour de la semaine
        } else if (range === '1m' || range === '6m') {
          return d.toLocaleString('default', { month: 'short', day: 'numeric' }); // Format mois/jour
        } else {
          return d.toLocaleString('default', { month: 'short', year: 'numeric' }); // Format mois/année pour autres périodes
        }
      };

      data = data.map(item => ({
        ...item,
        date: formatDate(item.date)
      }));

      setHistoricalData(data);
      setPreviousPrice(data[data.length - 2].close); // Set the previous price
      setCurrentPrice(data[data.length - 1].close); // Set the most recent price
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/quote-short/AAPL?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      setCurrentPrice(response.data[0].price);
    } catch (err) {
      console.error('Failed to fetch current price:', err);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
    fetchCurrentPrice(); // Initial fetch

    const interval = setInterval(() => {
      fetchCurrentPrice();
    }, 5000); // Fetch current price every minute

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const priceStyle = {
    color: currentPrice > previousPrice ? 'green' : 'red',
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '20px', borderRadius: '10px' }}>
      <h2 style={priceStyle}>
        Prix actuel: {currentPrice} USD {currentPrice > previousPrice ? `(+${(currentPrice - previousPrice).toFixed(2)})` : `(${(currentPrice - previousPrice).toFixed(2)})`}
      </h2>
      <div style={{ marginBottom: '20px' }}>
        <button style={{ marginRight: '10px' }} onClick={() => handleTimeRangeChange('1y')}>1 an</button>
        <button style={{ marginRight: '10px' }} onClick={() => handleTimeRangeChange('5y')}>5 ans</button>
        <button style={{ marginRight: '10px' }} onClick={() => handleTimeRangeChange('6m')}>6 mois</button>
        <button style={{ marginRight: '10px' }} onClick={() => handleTimeRangeChange('1m')}>1 mois</button>
        <button style={{ marginRight: '10px' }} onClick={() => handleTimeRangeChange('1w')}>1 semaine</button>
      </div>
      <ResponsiveContainer width="70%" height={400}>
        <LineChart
          data={historicalData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" stroke="#000000" />
          <YAxis stroke="#000000" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ccc' }} itemStyle={{ color: '#000' }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#00FF00" // Green line color
            dot={{ stroke: '#00FF00', strokeWidth: 2, r: 0 }} // Remove dots
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
