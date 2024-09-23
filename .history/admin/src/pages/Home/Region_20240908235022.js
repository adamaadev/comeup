import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Region() {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductData = async () => {
    try {
      const response = await axios.get('https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=AAPL&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
      const productStats = response.data;

      // Utiliser seulement les données de l'année la plus récente (2023-09-30)
      const latestYear = Object.keys(productStats[0])[0]; // Supposons que les données sont triées par année
      const latestProductData = productStats[0][latestYear];
      
      const formattedProductData = Object.keys(latestProductData).map(key => ({
        name: key,
        value: latestProductData[key]
      }));

      setProductData(formattedProductData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false); // Assurez-vous que loading est mis à false après l'opération
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

  return (
    <div className="chart-container">
      <h2>Apple Revenue Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'space-around' }}>
          {/* Diagramme circulaire pour les ventes de produits */}
          <div style={{ width: '45%' }}>
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
