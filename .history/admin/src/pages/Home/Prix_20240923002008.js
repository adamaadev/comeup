import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Nav, Tab } from 'react-bootstrap';

export default function Prix({ symbol }) {
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

      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=${days}&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
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
          data = data.filter((item) => {
            const date = new Date(item.date);
            const dayOfWeek = date.getDay();
            // Exclure les samedis (6) et dimanches (0)
            return dayOfWeek !== 0 && dayOfWeek !== 6;
          });
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
      setPreviousPrice(data[data.length - 2]?.close || 0);
      setCurrentPrice(data[data.length - 1]?.close || 0);
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

  const priceStyle = {
    color: currentPrice > previousPrice ? 'green' : 'red',
  };

  const priceChangePercentage = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '20px', borderRadius: '10px' }}>
      <h4>Evolution du cours de l'action</h4>
      <h4 style={priceStyle}>
        Prix actuel: {currentPrice} USD {currentPrice > previousPrice ? `( +${priceChangePercentage}%)` : `(${(currentPrice - previousPrice).toFixed(2)} / ${priceChangePercentage}%)`}
      </h4>
      <div style={{marginLeft:"30px", marginTop:"10px"}}>
      <Tab.Container defaultActiveKey="1y" >
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="1w" onClick={() => setTimeRange('1w')}>1 semaine</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="1m" onClick={() => setTimeRange('1m')}>1 mois</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="6m" onClick={() => setTimeRange('6m')}>6 mois</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ytd" onClick={() => setTimeRange('ytd')}>YTD</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="1y" onClick={() => setTimeRange('1y')}>1 an</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="5y" onClick={() => setTimeRange('5y')}>5 ans</Nav.Link>
          </Nav.Item>
        </Nav>
      </Tab.Container>
      </div>
      <ResponsiveContainer width="100%" height={305} style={{marginTop : "10px"}}>
        <LineChart
          data={historicalData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
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
  );
}