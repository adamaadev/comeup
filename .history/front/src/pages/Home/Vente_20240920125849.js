import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';

export default function Vente({ symbol }) {
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState(''); // Ajouter un état pour le logo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const predefinedColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8A2BE2', '#FFD700'];

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
            return { name: key, value }; // Return name and value
          });
          setProductData(formattedProductData);
        } else {
          setProductData([]); // No data available
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

  // Vérification supplémentaire pour éviter les erreurs si data ou index sont indéfinis
  const renderCustomLabel = (props, data) => {
    const { cx, cy, midAngle, outerRadius, index } = props;

    if (!data || !data[index]) return null; // Vérification si les données existent

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 250; // Adjust this value to extend the line length
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontWeight: 'bold' }}
      >
        {`${data[index].name}: $${(data[index].value / 1e9).toFixed(1)}B`}
      </text>
    );
  };

  const renderLabelLine = (props) => {
    const { cx, cy, midAngle, outerRadius } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 250; // This controls the length of the connecting line
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke="black"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
    );
  };

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
                outerRadius={150}
                innerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={(props) => renderCustomLabel(props, productData)} // Appel de la fonction avec vérification des données
                labelLine={renderLabelLine} // Apply custom label line renderer here
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
