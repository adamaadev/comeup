import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'United States', value: 36.2, color: '#0088FE' },
  { name: 'Europe', value: 24.6, color: '#00C49F' },
  { name: 'Greater China', value: 18.9, color: '#FFBB28' },
  { name: 'Rest of Asia Pacific', value: 7.7, color: '#FF8042' },
  { name: 'Japan', value: 6.3, color: '#A85ECD' },
  { name: 'Americas, excluding US', value: 6.3, color: '#FFD700' },
];

const PieChartComponent = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
