import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Vente({ symbol }) {
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const predefinedColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for product segmentation

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product revenue data
        const productResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=${symbol}&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`
        );
        
        const productDataRaw = productResponse.data[0];
        const latestProductData = productDataRaw && Object.values(productDataRaw)[0];

        if (latestProductData) {
          const formattedProductData = Object.entries(latestProductData).map(([key, value]) => {
            return { name: key, value }; // Removed random color generation
          });
          setProductData(formattedProductData);
        }

      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setProductData([]);
      setLogo('');
      setError(null);
    };
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

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="chart-wrapper" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '3rem' }}>
      <div style={{ width: '85%', position: 'relative' }}>
        <h3>Segmentation Produit</h3>
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
                <Cell key={`cell-${index}`} fill={predefinedColors[index % predefinedColors.length]} /> {/* Use predefined colors */}
              ))
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
