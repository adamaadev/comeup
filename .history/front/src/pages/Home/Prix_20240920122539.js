import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Nav, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      let startDate = new Date();
      const today = new Date().toISOString().split('T')[0];

      switch (range) {
        case '1y':
          days = 365;
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
        default:
          data = data.filter(() => true);
          break;
      }

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
    fetchData(timeRange);
    fetchCurrentPrice();

    const interval = setInterval(() => {
      fetchCurrentPrice();
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

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

      <Tab.Container defaultActiveKey="1y">
        <div className="scrollable-tabs">
          <Nav variant="tabs" className="flex-nowrap">
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
              <Nav.Link eventKey="1y" onClick={() => setTimeRange('1y')}>1 an</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="5y" onClick={() => setTimeRange('5y')}>5 ans</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="YTD" onClick={() => setTimeRange('YTD')}>YTD</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Tab.Container>

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
