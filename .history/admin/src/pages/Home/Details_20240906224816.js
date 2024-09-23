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
  const [timeRange, setTimeRange] = useState('1y'); 

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
          days = 183;
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

      switch (range) {
        case '1y':
          data = data.filter((item) => {
            const date = new Date(item.date);
            return date.getDate() === 1;
          });
          break;
        case '5y':
          data = data.filter((item, index) => index % 30 === 0);
          break;
        case '6m':
          data = data.filter((item, index) => index % 5 === 0);
          break;
        case '1m':
          break;
        case '1w':
          break;
        default:
          data = data.filter(() => true);
          break;
      }

      const formatDate = (date) => {
        const d = new Date(date);
        if (range === '1w') {
          return d.toLocaleDateString();
        } else if (range === '1m' || range === '6m') {
          return d.toLocaleString('default', { month: 'short', day: 'numeric' });
        } else {
          return d.toLocaleString('default', { month: 'short', year: 'numeric' });
        }
      };

      data = data.map(item => ({
        ...item,
        date: formatDate(item.date)
      }));

      setHistoricalData(data);
      setPreviousPrice(data[data.length - 2].close);
      setCurrentPrice(data[data.length - 1].close);
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
    fetchCurrentPrice();

    const interval = setInterval(() => {
      fetchCurrentPrice();
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="stock-chart-container">
      <h2 className={currentPrice > previousPrice ? 'price-positive' : 'price-negative'}>
        Prix actuel: {currentPrice} USD {currentPrice > previousPrice ? `(+${(currentPrice - previousPrice).toFixed(2)})` : `(${(currentPrice - previousPrice).toFixed(2)})`}
      </h2>
      <div className="chart-buttons">
        <button className="chart-button" onClick={() => handleTimeRangeChange('1y')}>1 an</button>
        <button className="chart-button" onClick={() => handleTimeRangeChange('5y')}>5 ans</button>
        <button className="chart-button" onClick={() => handleTimeRangeChange('6m')}>6 mois</button>
        <button className="chart-button" onClick={() => handleTimeRangeChange('1m')}>1 mois</button>
        <button className="chart-button" onClick={() => handleTimeRangeChange('1w')}>1 semaine</button>
      </div>
      <ResponsiveContainer className="responsive-container">
        <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid className="chart-grid" />
          <XAxis dataKey="date" stroke="#000000" />
          <YAxis stroke="#000000" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ccc' }} itemStyle={{ color: '#000' }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            className="chart-line"
            dot={{ stroke: '#00FF00', strokeWidth: 2, r: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
