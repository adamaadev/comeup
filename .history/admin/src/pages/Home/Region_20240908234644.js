import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF'];

const Region = () => {
  const [data, setData] = useState([]);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    // Requête pour récupérer les segments de revenus
    axios.get('https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=AAPL&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX')
      .then(response => {
        const revenueData = response.data[0]['2023-09-30']; // Prendre les données les plus récentes
        const formattedData = [
          { name: 'Americas Segment', value: revenueData['Americas Segment'], color: '#0088FE' },
          { name: 'Europe Segment', value: revenueData['Europe Segment'], color: '#00C49F' },
          { name: 'Greater China Segment', value: revenueData['Greater China Segment'], color: '#FFBB28' },
          { name: 'Japan Segment', value: revenueData['Japan Segment'], color: '#FF8042' },
          { name: 'Rest of Asia Pacific Segment', value: revenueData['Rest of Asia Pacific Segment'], color: '#A28EFF' }
        ];
        setData(formattedData);
      })
      .catch(error => console.error("Erreur lors de la récupération des segments de revenus :", error));

    // Requête pour récupérer le logo
    axios.get('https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX')
      .then(response => {
        const imageUrl = response.data[0].image;
        setLogo(imageUrl); // On stocke l'URL du logo
      })
      .catch(error => console.error("Erreur lors de la récupération du logo :", error));
  }, []);

  return (
    <div style={{ position: 'relative', width: '400px', height: '400px' }}>
      {data.length > 0 && (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
            data={[{ value: 100 }]}
            cx={200}
            cy={200}
            innerRadius={0}
            outerRadius={100}
            fill="#fff"
            dataKey="value"
          />
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      {/* Logo affiché au centre */}
      {logo && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '170px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '70%',
              height: '70%',
              background: 'transparent',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Region;
