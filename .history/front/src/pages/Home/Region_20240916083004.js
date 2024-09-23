import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Region({ symbol }) {
  const [geoData, setGeoData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  const predefinedColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupération des données géographiques
        const geoResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=${symbol}&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`
        );
        const geoDataRaw = geoResponse.data[0];
        const latestGeoData = geoDataRaw && Object.values(geoDataRaw)[0];

        if (latestGeoData) {
          const formattedGeoData = Object.entries(latestGeoData).map(([key, value]) => ({ name: key, value }));
          setGeoData(formattedGeoData);
          setHasData(true);
        } else {
          setHasData(false);
        }

        // Récupération des données produits
        const productResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=${symbol}&structure=flat&period=annual&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`
        );
        const productDataRaw = productResponse.data[0];
        const latestProductData = productDataRaw && Object.values(productDataRaw)[0];

        if (latestProductData) {
          const formattedProductData = Object.entries(latestProductData).map(([key, value]) => ({ name: key, value }));
          setProductData(formattedProductData);
        } else {
          setProductData([]);
        }

        // Récupération du logo
        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol });
        const logoUrl = logoResponse.data[0]?.logo;
        setLogo(logoUrl);

      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données.');
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setGeoData([]);
      setProductData([]);
      setLogo('');
      setError(null);
      setHasData(false);
    };
  }, [symbol]);

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, index }, data) => {
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
      {productData.length > 0 && (
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
                label={(props) => renderCustomLabel(props, productData)}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={predefinedColors[index % predefinedColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" align="center" />
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
      )}
    </>
  ) : (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <p>Données indisponibles</p>
    </div>
  )}
</div>
