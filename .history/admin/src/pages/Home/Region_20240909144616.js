import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        const geoResponse = await axios.get(`https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=AAPL&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
        const geoData = geoResponse.data[0]['2023-09-30'];
        const formattedGeoData = [
          { name: 'Americas Segment', value: geoData['Americas Segment'], color: '#0088FE' },
          { name: 'Europe Segment', value: geoData['Europe Segment'], color: '#00C49F' },
          { name: 'Greater China Segment', value: geoData['Greater China Segment'], color: '#FFBB28' },
          { name: 'Japan Segment', value: geoData['Japan Segment'], color: '#FF8042' },
          { name: 'Rest of Asia Pacific Segment', value: geoData['Rest of Asia Pacific Segment'], color: '#A28EFF' }
        ];
        setGeoData(formattedGeoData);
        // Fetch logo
        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol  });
        const logoUrl = logoResponse.data[0]?.logo; // Assurer que le logo est présent dans la réponse
        setLogo(logoUrl);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]); // Include `symbol` as a dependency to refetch when it changes

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F61', '#6A5ACD'];

  return (
    <div className="chart-container" style={{ padding: '20px' }}>
      <h2>Apple Revenue Data {symbol}</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Geographic Revenue Pie Chart */}
          <div style={{ width: '45%', position: 'relative' }}>
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
        paddingAngle={5}
        dataKey="value"
      >
        {geoData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Pie
        data={[{ value: 100 }]}
        cx="50%"
        cy="50%"
        innerRadius={0}
        outerRadius={100}
        fill="#fff"
        dataKey="value"
      />
      <Tooltip />
      <Legend layout="horizontal" align="center" verticalAlign="bottom" />
    </PieChart>
  </ResponsiveContainer>
  {logo && (
    <div
      style={{
        position: 'absolute',
        top: '53%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '180px',
        height: '150px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '100%', // Ajusté pour prendre toute la place
          height: '100%', // Ajusté pour prendre toute la place
          background: 'transparent',
          objectFit: 'contain', // Assure que l'image est correctement contenue
        }}
      />
    </div>
  )}
</div>
        </div>
      )}
    </div>
  );
}
