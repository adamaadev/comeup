import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FFC658'];

const DonutChart = () => {
  const [data, setData] = useState([]);
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

  useEffect(() => {
    // Requête pour récupérer les données géographiques
    const fetchData = async () => {
      try {
        const response = await axios.get('https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=AAPL&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
        const fetchedData = response.data;

        const formattedData = fetchedData.map(item => {
          return {
            name: item.geographicArea,
            value: item.revenue,
            color: COLORS[Math.floor(Math.random() * COLORS.length)] // Attribue une couleur aléatoire
          };
        });
        
        setData(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données géographiques :", error);
      }
    };

    fetchData();
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
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
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
