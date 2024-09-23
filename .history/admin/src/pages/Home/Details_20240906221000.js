import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Les données du graphique
const data = [
  { name: 'United States', value: 36.2, color: '#0088FE' },
  { name: 'Europe', value: 24.6, color: '#00C49F' },
  { name: 'Greater China', value: 18.9, color: '#FFBB28' },
  { name: 'Rest of Asia Pacific', value: 7.7, color: '#FF8042' },
  { name: 'Japan', value: 6.3, color: '#A85ECD' },
  { name: 'Americas, excluding US', value: 6.3, color: '#FFD700' },
];

// Composant personnalisé de légende avec des tirets
const CustomLegend = ({ payload }) => {
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ marginBottom: 10 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              backgroundColor: entry.color,
              marginRight: 10,
            }}
          ></span>
          <span style={{ fontWeight: 'bold' }}>{entry.value}B</span> - {entry.payload.name}
        </li>
      ))}
    </ul>
  );
};

// Le composant principal
const PieChartComponent = () => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Position du logo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        {/* Image du logo Apple */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
          alt="Apple logo"
          style={{ width: 60, height: 60 }}
        />
      </div>

      {/* Le graphique */}
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        {/* Légende personnalisée */}
        <Legend content={<CustomLegend />} />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
