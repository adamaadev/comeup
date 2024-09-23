import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Prix({ symbol }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1d'); // Changer à 1 jour

  const fetchData = async () => {
    setLoading(true);
    try {
      const days = 1; // Changer à 1 jour
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=${days}&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      let data = response.data.historical.reverse();

      // Inutile de filtrer pour '1d', on prend toutes les données
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      };

      data = data.map(item => ({
        ...item,
        date: formatDate(item.date)
      }));

      setHistoricalData(data);
      setPreviousPrice(data[data.length - 2]?.close);
      setCurrentPrice(data[data.length - 1]?.close);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      setCurrentPrice(response.data[0].price);
    } catch (err) {
      console.error('Failed to fetch current price:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCurrentPrice();

    const interval = setInterval(() => {
      fetchCurrentPrice();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const priceStyle = {
    color: currentPrice > previousPrice ? 'green' : 'red',
    fontSize: '1.5em',
    fontWeight: 'bold',
  };
  
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '20px', borderRadius: '10px' }}>
      <h2 style={priceStyle}>
        Prix actuel : {currentPrice} USD {currentPrice > previousPrice ? `(+${(currentPrice - previousPrice).toFixed(2)})` : `(${(currentPrice - previousPrice).toFixed(2)})`}
      </h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
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
              stroke="#00FF00"
              dot={{ stroke: '#00FF00', strokeWidth: 2, r: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
