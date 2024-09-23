import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const data = [
  { name: 'United States', value: 94.0, color: '#0088FE' },
  { name: 'Europe', value: 64.1, color: '#00C49F' },
  { name: 'Greater China', value: 72.0, color: '#FFBB28' },
  { name: 'Rest of Asia Pacific', value: 29.6, color: '#FF8042' },
  { name: 'Japan', value: 24.3, color: '#A28EFF' },
  { name: 'Americas, excl. USA', value: 24.0, color: '#FFC658' }
];

const COLORS = data.map(d => d.color);

const DonutChart = () => {
  const [logo, setLogo] = useState('');

  useEffect(() => {
    // Requête pour récupérer le logo d'Apple
    axios.get('https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX')
      .then(response => {
        const imageUrl = response.data[0].image;
        setLogo(imageUrl); // On stocke l'URL du logo
      })
      .catch(error => console.error("Erreur lors de la récupération du logo :", error));
  }, []);

  return (
    <div style={{ position: 'relative', width: '400px', height: '400px' }}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          innerRadius={100}  // Radius interne pour faire de l'espace pour le logo
          outerRadius={140}  // Radius externe du diagramme
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Logo d'Apple affiché au centre */}
      {logo && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '200px', 
            height: '200px',  // Ajuster pour toucher le bord du diagramme interne
            borderRadius: '50%',  // Cercle parfait
            overflow: 'hidden'  // Masquer les parties qui dépassent
          }}
        >
          <img 
            src={logo} 
            alt="Apple logo" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'  // Assure que l'image remplit bien le cercle 
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default DonutChart;
