import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

// Données d'exemple (à adapter en fonction de vos données)
const data = [
  { date: '2019', value: 250 },
  { date: '2020', value: 320 },
  { date: '2021', value: 370 },
  { date: '2022', value: 400 },
  { date: '2023', value: 450 },
  // Ajoutez plus de données ici
];

const CustomChart = () => {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={[200, 500]} />
      <Tooltip />
      <Legend />
      <ReferenceLine y={400} label="Prix juste" stroke="blue" strokeDasharray="3 3" />
      <Line type="monotone" dataKey="value" stroke="#00CED1" />
    </LineChart>
  );
};

export default CustomChart;
