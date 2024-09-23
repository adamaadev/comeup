import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Region({ symbol }) {
  const [geoData, setGeoData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  const predefinedColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for each region

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch geographic revenue data
        const geoResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=${symbol}&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`
        );
        
        const geoDataRaw = geoResponse.data[0];
        
        const latestGeoData = geoDataRaw && Object.values(geoDataRaw)[0];
        
        if (latestGeoData) {
          const formattedGeoData = Object.entries(latestGeoData).map(([key, value]) => {
            return { name: key, value }; // Removed random color generation
          });
          setGeoData(formattedGeoData);
          setHasData(true);
        } else {
          setHasData(false);
        }

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
      setLogo('');
      setError(null);
      setHasData(false);
    };
  }, [symbol]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }, data) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius *  Math.sin(-midAngle * RADIAN);

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
      {hasData ? (
        <>
          {/* Geographic Revenue Chart */}
          <div style={{ width: '75%', position: 'relative' }}>
            <h3>Segmentation Géographique</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={geoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                  label={(props) => renderCustomLabel(props, geoData)}
                >
                  {geoData.map((entry, index) => (
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
        </>
      ) : (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p>Données indisponibles</p>
        </div>
      )}
    </div>
  );
}
