import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Region({ symbol }) {
  const [geoData, setGeoData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch geographic revenue data
        const geoResponse = await axios.get('https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=AAPL&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
        const geoData = geoResponse.data[0]['2023-09-30'];
        const formattedGeoData = [
          { name: 'Americas Segment', value: geoData['Americas Segment'], color: '#0088FE' },
          { name: 'Europe Segment', value: geoData['Europe Segment'], color: '#00C49F' },
          { name: 'Greater China Segment', value: geoData['Greater China Segment'], color: '#FFBB28' },
          { name: 'Japan Segment', value: geoData['Japan Segment'], color: '#FF8042' },
          { name: 'Rest of Asia Pacific Segment', value: geoData['Rest of Asia Pacific Segment'], color: '#A28EFF' }
        ];
        setGeoData(formattedGeoData);

        // Fetch product revenue data
        const productResponse = await axios.get('https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=AAPL&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
        const productData = productResponse.data[0]['2023-09-30'];
        const formattedProductData = [
          { name: 'iPhone', value: productData.iPhone, color: '#0088FE' },
          { name: 'Mac', value: productData.Mac, color: '#00C49F' },
          { name: 'iPad', value: productData.iPad, color: '#FFBB28' },
          { name: 'Wearables, Home and Accessories', value: productData['Wearables, Home and Accessories'], color: '#FF8042' },
          { name: 'Service', value: productData.Service, color: '#A28EFF' }
        ];
        setProductData(formattedProductData);

        // Fetch logo
        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol: 'AAPL' });
        const logoUrl = logoResponse.data[0]?.logo;
        setLogo(logoUrl);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }, data) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontWeight: 'bold', lineHeight: '2' }}
      >
        {`${data[index].name}: $${(data[index].value / 1e9).toFixed(1)}B`}
      </text>
    );
  };

  return (
    <div className="chart-container" style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', height: '100vh' }}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper" style={{ display: 'flex', width: '150%', alignItems: 'center' }}>
          {/* Geographic Revenue Chart */}
          <div style={{ width: '198%', position: 'relative' }}>
            <h3>Geographic Revenue Distribution (2023)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={geoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  label={(props) => renderCustomLabel(props, geoData)}
                >
                  {geoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {logo && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px',
                  overflow: 'hidden',
                  marginTop: '40px'
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
          </div>

          {/* Product Revenue Chart */}
          <div style={{ width: '48%', position: 'relative' , marginLeft : '50%'}}>
            <h3>Product Revenue Distribution (2023)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  label={(props) => renderCustomLabel(props, productData)}
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
