import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export default function Vente({ symbol }) {
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const predefinedColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=${symbol}&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`
        );
        
        const productDataRaw = productResponse.data[0];
        const latestProductData = productDataRaw && Object.values(productDataRaw)[0];

        if (latestProductData) {
          const formattedProductData = Object.entries(latestProductData).map(([key, value]) => {
            return { name: key, value };
          });
          setProductData(formattedProductData);
        } else {
          setProductData([]);
        }

        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol });
        const logoUrl = logoResponse.data[0]?.logo;
        setLogo(logoUrl);

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

  const CustomLabel = ({ x, y, value }) => (
    <g>
      <text x={x} y={y - 10} fill="black" textAnchor="middle" dominantBaseline="central" style={{ fontWeight: 'bold' }}>
        {value}
      </text>
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={y - 20}
        stroke="black"
        strokeWidth="1"
      />
    </g>
  );

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="chart-wrapper" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '3rem' }}>
      {productData.length > 0 ? (
        <div style={{ width: '85%', position: 'relative' }}>
          <h3>Segmentation Produit</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={100}
                fill="#8884d8"
                dataKey="value"
                labelLine={false} // Disable default label lines
                label={<CustomLabel />}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={predefinedColors[index % predefinedColors.length]} />
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
                marginTop: '10px'
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
      ) : (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p>Données indisponibles</p>
        </div>
      )}
    </div>
  );
}
