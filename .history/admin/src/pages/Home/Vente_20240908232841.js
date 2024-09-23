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
    // Requête pour récupérer le logo
    axios.get('https://financialmodelingprep.com/api/v3/profile/KO?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX')
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
          innerRadius={100}  // Rayon interne pour l'espace pour le logo
          outerRadius={140}  // Rayon externe du diagramme
          fill="#8884d8"
          paddingAngle={1}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Pie 
          data={[{ value: 100 }]}  // Une seule donnée pour remplir l'intérieur
          cx={200}
          cy={200}
          innerRadius={0}
          outerRadius={100}  // Rayon interne du premier diagramme
          fill="#fff"  // Couleur grise pour l'intérieur
          dataKey="value"
        />
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Logo affiché au centre */}
      {logo && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '180px',  // Ajustement de la taille du logo pour être bien centré
            height: '170px',  // Ajustement de la hauteur du logo
            borderRadius: '50%',  // Cercle parfait
            overflow: 'hidden',  // Masquer les parties qui dépassent
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
              background : 'transparent'
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default DonutChart;
