import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Region() {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fetchLogo = async () => {
    try {
      const response = await axios.get('https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
      const companyData = response.data[0];
      setLogo(companyData.image);
    } catch (err) {
      setError(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=AAPL&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
      const fetchedData = response.data;

      const formattedData = fetchedData.map(item => {
        const [date, values] = Object.entries(item)[0];
        return {
          name: date,
          ...values
        };
      });

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

  const fetchProductData = async () => {
    try {
      const response = await axios.get('https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=AAPL&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
      const productStats = response.data;

      // Utiliser seulement les données de l'année la plus récente (2023-09-30)
      const latestProductData = productStats[0]["2023-09-30"];
      
      const formattedProductData = Object.keys(latestProductData).map(key => ({
        name: key,
        value: latestProductData[key]
      }));

      setProductData(formattedProductData);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLogo();
    fetchProductData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

  return (
    <div className="chart-container">
      <h2>Revenue Geographic Segmentation</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper">
          {/* Diagramme circulaire pour la segmentation géographique */}
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
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
          
          <img src={logo} alt="Company Logo" className="logo-overlay" />

          <h2>Product Sales Stats (2023)</h2>
          {/* Diagramme circulaire pour les ventes de produits */}
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
