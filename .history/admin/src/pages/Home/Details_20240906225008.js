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
  const [timeRange, setTimeRange] = useState('1m'); // Default to 1 month

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
          days = 183; // Approx. 6 months
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

      // Filter data based on the range
      switch (range) {
        case '1y':
          data = data.filter((item) => new Date(item.date).getDate() === 1); // First day of each month
          break;
        case '5y':
          data = data.filter((item, index) => index % 30 === 0); // One point every month (approx)
          break;
        case '6m':
          data = data.filter((item, index) => index % 5 === 0); // One point every five days (approx)
          break;
        case '1m':
        case '1w':
          // No filtering needed for 1 month and 1 week
          break;
        default:
          data = data.filter(() => true); // Default to showing all data
          break;
      }

      const formatDate = (date) => {
        const d = new Date(date);
        if (range === '1w') {
          return d.toLocaleDateString(); // Full date for 1 week
        } else if (range === '1m' || range === '6m') {
          return d.toLocaleString('default', { month: 'short', day: 'numeric' }); // Month/day for 1 month or 6 months
        } else {
          return d.toLocaleString('default', { month: 'short', year: 'numeric' }); // Month/year for other ranges
        }
      };

      data = data.map(item => ({
        ...item,
        date: formatDate(item.date),
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
    fetchCurrentPrice();

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
        Current Price: {currentPrice} USD {currentPrice > previousPrice ? `(+${(currentPrice - previousPrice).toFixed(2)})` : `(${(currentPrice - previousPrice).toFixed(2)})`}
      </h2>
      <div style={{ marginBottom: '20px' }}>
        <ul className="tab-list">
          <li className={`tab-item ${timeRange === '1w' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('1w')}>1 Week</li>
          <li className={`tab-item ${timeRange === '1m' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('1m')}>1 Month</li>
          <li className={`tab-item ${timeRange === '6m' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('6m')}>6 Months</li>
          <li className={`tab-item ${timeRange === '1y' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('1y')}>1 Year</li>
          <li className={`tab-item ${timeRange === '5y' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('5y')}>5 Years</li>
        </ul>
      </div>
      <ResponsiveContainer width="70%" height={400}>
        <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" stroke="#000000" />
          <YAxis stroke="#000000" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ccc' }} itemStyle={{ color: '#000' }} />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#00FF00" dot={{ stroke: '#00FF00', strokeWidth: 2, r: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
