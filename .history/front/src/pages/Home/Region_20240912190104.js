import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueGeographicSegmentation = () => {
  const symbol = 'CPA'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fetchLogo = async () => {
    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      const companyData = response.data[0];
      setLogo(companyData.logo);
    } catch (err) {
      setError(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=${symbol}&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      const fetchedData = response.data;

      // Gestion des différentes structures de données
      const formattedData = fetchedData.map(item => {
        const [date, values] = Object.entries(item)[0];
        
        // Unifiez les segments de différentes entreprises
        const unifiedValues = Object.keys(values).reduce((acc, key) => {
          let standardizedKey = key;

          // Normalisez certaines clés (par exemple, "UNITED STATES" peut être normalisé en "Americas Segment")
          if (key.toLowerCase().includes('united states') || key.toLowerCase().includes('americas')) {
            standardizedKey = 'Americas Segment';
          } else if (key.toLowerCase().includes('non us') || key.toLowerCase().includes('europe')) {
            standardizedKey = 'Non US Segment';
          }

          acc[standardizedKey] = values[key];
          return acc;
        }, {});

        return {
          name: date,
          ...unifiedValues
        };
      });

      // Agréger les données pour chaque région
      const aggregatedData = formattedData.reduce((acc, item) => {
        Object.keys(item).forEach(key => {
          if (key !== 'name') {
            if (!acc[key]) {
              acc[key] = 0;
            }
            acc[key] += item[key];
          }
        });
        return acc;
      }, {});

      // Convertir l'objet agrégé en tableau pour le graphique
      const pieData = Object.keys(aggregatedData).map(key => ({
        name: key,
        value: aggregatedData[key]
      }));

      setData(pieData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLogo();
  }, [symbol]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

  return (
    <div className="chart-container">
      <h2>{symbol} Revenue Geographic Segmentation</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(data, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {logo && <img src={logo} alt={`${symbol} Logo`} className="logo-overlay" />}
        </div>
      )}
    </div>
  );
};