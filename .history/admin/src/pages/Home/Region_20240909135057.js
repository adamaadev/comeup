import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Region({ symbol }) {
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product revenue data
        const productResponse = await axios.get(
          'https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=AAPL.MX&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX'
        );
        const productStats = productResponse.data;
        const latestYear = Object.keys(productStats[0])[0]; // Supposons que les données sont triées par année
        const latestProductData = productStats[0][latestYear];
        const formattedProductData = Object.keys(latestProductData).map((key) => ({
          name: key,
          value: latestProductData[key],
        }));
        setProductData(formattedProductData);

        // Fetch logo
        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol: 'KO' });
        const logoUrl = logoResponse.data[0]?.logo; // Assurer que le logo est présent dans la réponse
        setLogo(logoUrl);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F61', '#6A5ACD'];

  return (
    <div className="chart-container" style={{ padding: '20px' }}>
      <h2>Apple Revenue Data {symbol}</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Product Sales Pie Chart */}
          <div style={{ width: '100%' }}>
            <h3>Product Sales Stats (2023)</h3>
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
        </div>
      )}
    </div>
  );
}
