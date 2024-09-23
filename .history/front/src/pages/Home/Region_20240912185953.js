import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Region({ symbol }) {
  const [data, setData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Générer une couleur aléatoire
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

          // Normalisation des clés selon des segments géographiques standardisés
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
        value: aggregatedData[key],
        color: generateRandomColor(),
      }));

      setData(pieData);
      setLoading(false);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des données.');
      setLoading(false);
    }
  };

  const fetchLogo = async () => {
    try {
      const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol });
      const logoUrl = logoResponse.data[0]?.logo;
      setLogo(logoUrl);
    } catch (err) {
      console.error('Erreur lors de la récupération du logo', err);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchData();
      fetchLogo();
    }
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
      {/* Diagramme à secteurs pour la segmentation géographique */}
      <div style={{ width: '45%', position: 'relative' }}>
        <h3>Segmentation Géographique</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={(props) => renderCustomLabel(props, data)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
    </div>
  );
}
